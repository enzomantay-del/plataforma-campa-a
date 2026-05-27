import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";
import { ensureBarriosCargados } from "@/lib/ensure-barrios";
import { prisma } from "@/lib/prisma";
import { isPublicCargaKeyValid } from "@/lib/public-carga";
import { publicOptionsResponse, withPublicCors } from "@/lib/public-cors";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function OPTIONS(req: Request) {
  return publicOptionsResponse(req);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("k");

  if (!isPublicCargaKeyValid(key)) {
    return withPublicCors(
      req,
      NextResponse.json({ ok: false, error: "Enlace no válido." }, { status: 403 }),
    );
  }

  await ensureBarriosCargados();

  const barrios = await prisma.barrio.findMany({
    where: { activo: true },
    orderBy: BARRIOS_ORDER_BY,
    select: { id: true, nombre: true },
  });

  return withPublicCors(req, NextResponse.json({ ok: true, barrios }));
}
