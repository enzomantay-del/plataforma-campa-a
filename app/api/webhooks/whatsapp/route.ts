import { prisma } from "@/lib/prisma";
import { registrarRespuestaSondeo } from "@/lib/sondeo-incoming";
import { getWhatsAppAppSecret } from "@/lib/whatsapp-config";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Verificación suscripción Meta (GET). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verify = process.env.WHATSAPP_VERIFY_TOKEN;
  if (mode === "subscribe" && verify && token === verify && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ ok: false, hint: "WHATSAPP_VERIFY_TOKEN incorrecto o ausente." }, { status: 403 });
}

function verifyMetaSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = getWhatsAppAppSecret();
  if (!secret) return true;
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function mapEstadoMeta(status: string): string {
  switch (status) {
    case "sent":
      return "ENVIADO";
    case "delivered":
      return "ENTREGADO";
    case "read":
      return "LEIDO";
    case "failed":
      return "ERROR";
    default:
      return "ENVIADO";
  }
}

/** Actualización de estados de mensajes (POST). */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, sig)) {
    return NextResponse.json({ ok: false, error: "Firma inválida." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const obj = payload as {
    entry?: {
      changes?: {
        field?: string;
        value?: {
          messages?: {
            from?: string;
            id?: string;
            type?: string;
            text?: { body?: string };
          }[];
          statuses?: {
            id?: string;
            status?: string;
            errors?: { title?: string }[];
          }[];
        };
      }[];
    }[];
  };

  let updated = 0;
  let respuestasSondeo = 0;

  for (const entry of obj.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const messages = change.value?.messages;
      if (messages) {
        for (const msg of messages) {
          if (msg.type === "text" && msg.text?.body && msg.from) {
            const ok = await registrarRespuestaSondeo({
              telefonoRaw: msg.from,
              texto: msg.text.body,
              waMessageId: msg.id,
            });
            if (ok) respuestasSondeo++;
          }
        }
      }

      const statuses = change.value?.statuses;
      if (!statuses) continue;

      for (const st of statuses) {
        const waId = st.id;
        const status = st.status;
        if (!waId || !status) continue;

        const nuevo = mapEstadoMeta(status);
        let detalle = `Webhook Meta: ${status}`;
        if (status === "failed" && st.errors?.[0]?.title) {
          detalle = st.errors[0].title;
        }

        const r = await prisma.messageLog.updateMany({
          where: { waMessageId: waId },
          data: {
            estado: nuevo,
            detalle,
          },
        });
        updated += r.count;
      }
    }
  }

  return NextResponse.json({ ok: true, actualizados: updated, respuestasSondeo });
}
