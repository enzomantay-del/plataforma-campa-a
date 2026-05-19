"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearReferente(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return;
  await prisma.referente.create({ data: { nombre } });
  revalidatePath("/panel/referentes");
  revalidatePath("/panel/carga-publica");
  revalidatePath("/cargar");
}

export async function toggleReferente(id: string, activo: boolean) {
  await prisma.referente.update({ where: { id }, data: { activo } });
  revalidatePath("/panel/referentes");
  revalidatePath("/cargar");
}

export async function eliminarReferente(id: string) {
  await prisma.referente.delete({ where: { id } });
  revalidatePath("/panel/referentes");
  revalidatePath("/panel/carga-publica");
}
