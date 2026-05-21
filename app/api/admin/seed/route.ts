import { BARRIOS_JARDIN_AMERICA } from "@/lib/barrios-default";
import { ensureDbSchema } from "@/lib/ensure-db-schema";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function secretoValido(header: string | null): boolean {
  const h = header?.trim() ?? "";
  if (!h) return false;
  const permitidos = [process.env.SEED_SECRET?.trim(), process.env.PANEL_PASSWORD?.trim()].filter(
    Boolean,
  ) as string[];
  return permitidos.some((s) => s === h);
}

/** Crea tablas + carga barrios. Header x-seed-secret = SEED_SECRET o PANEL_PASSWORD de Netlify. */
export async function POST(req: Request) {
  if (!process.env.SEED_SECRET?.trim() && !process.env.PANEL_PASSWORD?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Configurá SEED_SECRET o PANEL_PASSWORD en Netlify." },
      { status: 503 },
    );
  }

  const header = req.headers.get("x-seed-secret");
  if (!secretoValido(header)) {
    return NextResponse.json({ ok: false, error: "Secreto incorrecto." }, { status: 403 });
  }

  try {
    await ensureDbSchema();

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
      mensaje: "Tablas y barrios listos. Agregá referentes desde el panel.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
