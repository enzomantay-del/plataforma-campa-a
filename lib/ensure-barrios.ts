import { BARRIOS_JARDIN_AMERICA } from "@/lib/barrios-default";
import { prisma } from "@/lib/prisma";

/** Garantiza barrios en base (útil si no corriste seed). */
export async function ensureBarriosCargados(): Promise<void> {
  const count = await prisma.barrio.count();
  if (count > 0) return;
  for (let i = 0; i < BARRIOS_JARDIN_AMERICA.length; i++) {
    const nombre = BARRIOS_JARDIN_AMERICA[i];
    await prisma.barrio.create({ data: { nombre, orden: i } });
  }
}
