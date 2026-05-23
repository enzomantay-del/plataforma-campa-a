import { contactosACsv, contactosParaExportar } from "@/lib/export-contactos-csv";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const barrioId = url.searchParams.get("barrioId")?.trim() || null;

  if (barrioId) {
    const existe = await prisma.barrio.findUnique({ where: { id: barrioId }, select: { nombre: true } });
    if (!existe) {
      return NextResponse.json({ ok: false, error: "Barrio no encontrado." }, { status: 404 });
    }
  }

  const rows = await contactosParaExportar(barrioId);
  const csv = contactosACsv(rows);

  const barrioNombre = barrioId
    ? (await prisma.barrio.findUnique({ where: { id: barrioId }, select: { nombre: true } }))?.nombre
    : null;
  const slug = barrioNombre ? barrioNombre.replace(/\s+/g, "-").toLowerCase() : "todos";
  const fecha = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contactos-${slug}-${fecha}.csv"`,
    },
  });
}
