import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";
import { prisma } from "@/lib/prisma";

/** Escapa un valor para CSV (Excel / LibreOffice). */
function celdaCsv(valor: string): string {
  const v = valor.replace(/"/g, '""');
  return /[",\n\r]/.test(v) ? `"${v}"` : v;
}

export async function contactosParaExportar(filtroBarrioId?: string | null) {
  return prisma.contacto.findMany({
    where: filtroBarrioId ? { barrioId: filtroBarrioId } : {},
    orderBy: [{ barrio: BARRIOS_ORDER_BY }, { apellido: "asc" }, { nombre: "asc" }],
    include: {
      barrio: { select: { nombre: true } },
      referente: { select: { nombre: true } },
    },
  });
}

export function contactosACsv(
  rows: Awaited<ReturnType<typeof contactosParaExportar>>,
): string {
  const header = "nombre,apellido,telefono,barrio,referente,notas,cargado";
  const lineas = rows.map((c) =>
    [
      celdaCsv(c.nombre),
      celdaCsv(c.apellido),
      celdaCsv(c.telefono),
      celdaCsv(c.barrio.nombre),
      celdaCsv(c.referente?.nombre ?? ""),
      celdaCsv(c.notas ?? ""),
      celdaCsv(c.creadoEn.toLocaleString("es-AR")),
    ].join(","),
  );
  return `\uFEFF${header}\n${lineas.join("\n")}`;
}
