import { isPublicCargaKeyValid } from "@/lib/public-carga";
import { publicOptionsResponse, withPublicCors } from "@/lib/public-cors";
import { checkRateLimit } from "@/lib/rate-limit";
import { enviarPlantillaWhatsApp } from "@/lib/whatsapp-api";
import { isWhatsAppConfigured } from "@/lib/whatsapp-config";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getAgendaTemplateName(): string {
  return process.env.WHATSAPP_AGENDA_TEMPLATE?.trim() || "agenda_evento_interno";
}

function getAgendaTemplateLang(): string {
  return process.env.WHATSAPP_AGENDA_TEMPLATE_LANG?.trim() || "es_AR";
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export async function OPTIONS(req: Request) {
  return publicOptionsResponse(req);
}

/** Avisos WhatsApp a encargados cuando cargan un evento en la agenda interna del portal. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!isPublicCargaKeyValid(url.searchParams.get("k"))) {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 }),
    );
  }

  if (!isWhatsAppConfigured()) {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "WhatsApp no configurado en campana-mvp." }, { status: 503 }),
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = checkRateLimit(`agenda:${ip}`, 15, 60_000);
  if (!limit.ok) {
    return withPublicCors(
      req,
      NextResponse.json(
        { ok: false, error: `Demasiados intentos. Esperá ${limit.retryAfterSec} s.` },
        { status: 429 },
      ),
    );
  }

  let body: {
    telefonos?: string[];
    excluirTelefono?: string | null;
    areaNombre?: string;
    tipoEvento?: string;
    titulo?: string;
    fecha?: string;
    hora?: string;
    lugar?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 }),
    );
  }

  const excluir = body.excluirTelefono ? normalizePhone(String(body.excluirTelefono)) : "";
  const unique = [
    ...new Set(
      (Array.isArray(body.telefonos) ? body.telefonos : [])
        .map((t) => normalizePhone(String(t)))
        .filter((t) => t.length >= 10 && t !== excluir),
    ),
  ];

  if (unique.length === 0) {
    return withPublicCors(
      req,
      NextResponse.json({
        ok: true,
        enviados: 0,
        fallidos: 0,
        aviso: "Sin destinatarios con WhatsApp cargado.",
      }),
    );
  }

  const areaNombre = String(body.areaNombre ?? "").trim().slice(0, 200) || "Municipalidad";
  const tipoEvento = String(body.tipoEvento ?? "").trim().slice(0, 120) || "Actividad";
  const titulo = String(body.titulo ?? "").trim().slice(0, 200) || "Evento";
  const fecha = String(body.fecha ?? "").trim().slice(0, 40);
  const hora = String(body.hora ?? "").trim().slice(0, 20);
  const lugar = String(body.lugar ?? "").trim().slice(0, 200) || "—";
  const fechaHora = hora ? `${fecha} ${hora}`.trim() : fecha;

  const bodyParams = [areaNombre, tipoEvento, titulo, fechaHora, lugar];
  const templateName = getAgendaTemplateName();
  const languageCode = getAgendaTemplateLang();

  let exitosos = 0;
  let fallidos = 0;
  const errores: string[] = [];

  for (const tel of unique) {
    const result = await enviarPlantillaWhatsApp({
      toE164OrDigits: tel,
      templateName,
      languageCode,
      bodyParameters: bodyParams,
    });
    if (result.ok) {
      exitosos += 1;
    } else {
      fallidos += 1;
      if (errores.length < 5) {
        errores.push(`${tel}: ${result.error}`);
      }
    }
  }

  return withPublicCors(
    req,
    NextResponse.json({
      ok: true,
      enviados: exitosos,
      fallidos,
      plantilla: templateName,
      errores,
    }),
  );
}
