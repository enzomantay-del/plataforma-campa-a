import { renderMensaje } from "@/lib/render-mensaje";
import { prisma } from "@/lib/prisma";
import { enviarPlantillaWhatsApp } from "@/lib/whatsapp-api";
import {
  getDefaultTemplateLanguage,
  getDefaultTemplateName,
  isWhatsAppConfigured,
} from "@/lib/whatsapp-config";
import { NextResponse } from "next/server";

/** Envío real por plantilla aprobada en Meta (Cloud API). */
export async function POST(req: Request) {
  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "WhatsApp no configurado. Copiá .env.example a .env y cargá WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as {
      nombre?: string;
      filtroBarrio?: string | null;
      templateName?: string;
      languageCode?: string;
      /** Textos para variables del cuerpo, en orden ({{1}}, {{2}}, …). */
      bodyParams?: string[];
    };

    const nombre = String(body.nombre ?? "").trim() || `WhatsApp ${new Date().toLocaleString("es-AR")}`;
    const filtro = body.filtroBarrio?.trim() || null;
    const templateName = (body.templateName || getDefaultTemplateName()).trim();
    const languageCode = (body.languageCode || getDefaultTemplateLanguage()).trim();
    let bodyParameters: string[] | undefined;
    if (Array.isArray(body.bodyParams) && body.bodyParams.length > 0) {
      bodyParameters = body.bodyParams.map(String);
    }

    const contactos = await prisma.contacto.findMany({
      where: filtro ? { barrio: { nombre: filtro } } : {},
      select: {
        id: true,
        telefono: true,
        nombre: true,
        apellido: true,
        barrio: { select: { nombre: true } },
      },
    });

    if (contactos.length === 0) {
      return NextResponse.json(
        { ok: false, error: filtro ? `No hay contactos en «${filtro}».` : "No hay contactos." },
        { status: 400 },
      );
    }

    const envio = await prisma.envio.create({
      data: {
        nombre,
        filtroBarrio: filtro,
        estado: "ENVIANDO",
        descripcion: `Plantilla «${templateName}» (${languageCode})`,
      },
    });

    let okCount = 0;
    let errCount = 0;

    for (let i = 0; i < contactos.length; i++) {
      const c = contactos[i];
      const params =
        bodyParameters && bodyParameters.length > 0
          ? bodyParameters.map((p) =>
              renderMensaje(p, { nombre: c.nombre, apellido: c.apellido, barrio: c.barrio.nombre }),
            )
          : undefined;

      const result = await enviarPlantillaWhatsApp({
        toE164OrDigits: c.telefono,
        templateName,
        languageCode,
        bodyParameters: params,
      });

      if (result.ok) {
        okCount++;
        await prisma.messageLog.create({
          data: {
            envioId: envio.id,
            contactoId: c.id,
            estado: "ENVIADO",
            waMessageId: result.messageId,
            detalle: "Aceptado por Meta",
          },
        });
      } else {
        errCount++;
        await prisma.messageLog.create({
          data: {
            envioId: envio.id,
            contactoId: c.id,
            estado: "ERROR",
            detalle: result.error.slice(0, 500),
          },
        });
      }

      if (i < contactos.length - 1) {
        await new Promise((r) => setTimeout(r, 120));
      }
    }

    const estadoFinal =
      errCount === 0 ? "COMPLETADO" : okCount === 0 ? "ERROR" : "PARCIAL";

    await prisma.envio.update({
      where: { id: envio.id },
      data: { estado: estadoFinal },
    });

    return NextResponse.json({
      ok: true,
      envioId: envio.id,
      destinatarios: contactos.length,
      exitosos: okCount,
      fallidos: errCount,
      estadoFinal,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno al enviar." }, { status: 500 });
  }
}
