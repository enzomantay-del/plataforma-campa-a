import { BARRIOS_JARDIN_AMERICA } from "@/lib/barrios-default";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Carga barrios iniciales (tablas se crean en el build de Netlify). */
export async function POST(req: Request) {
  const secret = process.env.SEED_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SEED_SECRET no configurado en Netlify." },
      { status: 503 },
    );
  }

  const header = req.headers.get("x-seed-secret");
  if (header !== secret) {
    return NextResponse.json(
      { ok: false, error: "Secreto incorrecto. En Netlify: SEED_SECRET = campana-seed-2026-interno" },
      { status: 403 },
    );
  }

  try {
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        ayuda: "Si dice que no existe la tabla Barrio, esperá el redeploy de Netlify y probá de nuevo.",
      },
      { status: 500 },
    );
  }
}
