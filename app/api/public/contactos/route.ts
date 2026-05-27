import { crearContactoConDedupe } from "@/lib/contacto-create";
import { ensureBarriosCargados } from "@/lib/ensure-barrios";
import { isPublicCargaKeyValid } from "@/lib/public-carga";
import { publicOptionsResponse, withPublicCors } from "@/lib/public-cors";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function OPTIONS(req: Request) {
  return publicOptionsResponse(req);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("k");

  if (!isPublicCargaKeyValid(key)) {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "Enlace no válido." }, { status: 403 }),
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = checkRateLimit(`carga:${ip}`, 30, 60_000);
  if (!limit.ok) {
    return withPublicCors(
      req,
      NextResponse.json(
        { ok: false, error: `Demasiados intentos. Esperá ${limit.retryAfterSec} segundos.` },
        { status: 429 },
      ),
    );
  }

  let body: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    barrioId?: string;
    referenteId?: string;
    notas?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 }),
    );
  }

  await ensureBarriosCargados();

  const result = await crearContactoConDedupe({
    nombre: String(body.nombre ?? ""),
    apellido: String(body.apellido ?? ""),
    telefono: String(body.telefono ?? ""),
    barrioId: String(body.barrioId ?? ""),
    referenteId: body.referenteId ? String(body.referenteId) : null,
    notas: body.notas ? String(body.notas) : null,
  });

  if (result.duplicado) {
    return withPublicCors(
      req,
      NextResponse.json({
        ok: false,
        duplicado: true,
        error: result.mensaje,
        existente: result.existente,
      }),
    );
  }

  if (!result.ok) {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: result.error }, { status: 400 }),
    );
  }

  return withPublicCors(req, NextResponse.json({ ok: true, id: result.id }));
}
