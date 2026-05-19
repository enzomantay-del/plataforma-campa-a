import { isWhatsAppConfigured } from "@/lib/whatsapp-config";
import { NextResponse } from "next/server";

/** Indica si las variables mínimas están cargadas (sin exponer secretos). */
export async function GET() {
  return NextResponse.json({
    configurado: isWhatsAppConfigured(),
  });
}
