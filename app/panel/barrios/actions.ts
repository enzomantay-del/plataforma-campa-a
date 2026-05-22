"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidarBarrios() {
  revalidatePath("/panel/barrios");
  revalidatePath("/panel/contactos");
  revalidatePath("/panel/envios");
  revalidatePath("/cargar");
}

export async function crearBarrio(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return;

  const maxOrden = await prisma.barrio.aggregate({ _max: { orden: true } });
  const orden = (maxOrden._max.orden ?? -1) + 1;

  await prisma.barrio.create({ data: { nombre, orden } });
  revalidarBarrios();
}

export async function renombrarBarrio(id: string, nombre: string) {
  const n = nombre.trim();
  if (!n) return;
  await prisma.barrio.update({ where: { id }, data: { nombre: n } });
  revalidarBarrios();
}

export async function toggleBarrio(id: string, activo: boolean) {
  await prisma.barrio.update({ where: { id }, data: { activo } });
  revalidarBarrios();
}

export async function eliminarBarrio(id: string) {
  const count = await prisma.contacto.count({ where: { barrioId: id } });
  if (count > 0) {
    await prisma.barrio.update({ where: { id }, data: { activo: false } });
  } else {
    await prisma.barrio.delete({ where: { id } });
  }
  revalidarBarrios();
}
