import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Simula un envío masivo: crea lote + un log por contacto (Fase 1 — sin WhatsApp real). */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { nombre?: string; filtroBarrio?: string | null };
    const nombre = String(body.nombre ?? "").trim() || `Envío ${new Date().toLocaleString("es-AR")}`;
    const filtro = body.filtroBarrio?.trim() || null;

    const contactos = await prisma.contacto.findMany({
      where: filtro ? { barrio: { nombre: filtro } } : {},
      select: { id: true },
    });

    if (contactos.length === 0) {
      return NextResponse.json(
        { ok: false, error: filtro ? `No hay contactos en el barrio «${filtro}».` : "No hay contactos cargados." },
        { status: 400 },
      );
    }

    const envio = await prisma.envio.create({
      data: {
        nombre,
        filtroBarrio: filtro,
        estado: "SIMULADO",
        descripcion: "Simulación Fase 1 — sin API WhatsApp",
      },
    });

    await prisma.messageLog.createMany({
      data: contactos.map((c) => ({
        envioId: envio.id,
        contactoId: c.id,
        estado: "SIMULADO_OK",
        detalle: "Simulado local — próxima fase: Cloud API Meta",
      })),
    });

    return NextResponse.json({
      ok: true,
      envioId: envio.id,
      destinatarios: contactos.length,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo simular el envío." }, { status: 500 });
  }
}
