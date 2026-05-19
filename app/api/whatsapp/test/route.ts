import { probarConexionWhatsApp } from "@/lib/whatsapp-api";
import {
  getWhatsAppPhoneNumberId,
  getWhatsAppVerifyToken,
  isWhatsAppConfigured,
} from "@/lib/whatsapp-config";
import { NextResponse } from "next/server";

export async function POST() {
  if (!isWhatsAppConfigured()) {
    return NextResponse.json({
      ok: false,
      configurado: false,
      error: "Completá WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID en .env y reiniciá el servidor.",
    });
  }

  const result = await probarConexionWhatsApp();

  return NextResponse.json({
    configurado: true,
    verifyTokenDefinido: Boolean(getWhatsAppVerifyToken()),
    phoneNumberId: getWhatsAppPhoneNumberId(),
    ...result,
  });
}
