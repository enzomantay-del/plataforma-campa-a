import { BARRIOS_JARDIN_AMERICA } from "@/lib/barrios-default";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Carga barrios iniciales (una vez). Header: x-seed-secret = SEED_SECRET en Netlify. */
export async function POST(req: Request) {
  const secret = process.env.SEED_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SEED_SECRET no configurado en el servidor." },
      { status: 503 },
    );
  }

  const header = req.headers.get("x-seed-secret");
  if (header !== secret) {
    return NextResponse.json({ ok: false, error: "Secreto incorrecto." }, { status: 403 });
  }

  for (let i = 0; i < BARRIOS_JARDIN_AMERICA.length; i++) {
    const nombre = BARRIOS_JARDIN_AMERICA[i];
    await prisma.barrio.upsert({
      where: { nombre },
      create: { nombre, orden: i },
      update: { orden: i, activo: true },
    });
  }

  const total = await prisma.barrio.count();
  return NextResponse.json({
    ok: true,
    barrios: total,
    mensaje: "Barrios cargados. Agregá referentes desde el panel.",
  });
}
