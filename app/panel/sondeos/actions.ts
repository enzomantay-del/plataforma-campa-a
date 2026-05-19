"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearSondeo(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const pregunta = String(formData.get("pregunta") ?? "").trim();
  if (!titulo || !pregunta) return;

  await prisma.sondeo.create({
    data: { titulo, pregunta, activo: false },
  });
  revalidatePath("/panel/sondeos");
}

export async function activarSondeo(id: string) {
  await prisma.$transaction([
    prisma.sondeo.updateMany({ data: { activo: false } }),
    prisma.sondeo.update({ where: { id }, data: { activo: true } }),
  ]);
  revalidatePath("/panel/sondeos");
}

export async function desactivarSondeo(id: string) {
  await prisma.sondeo.update({ where: { id }, data: { activo: false } });
  revalidatePath("/panel/sondeos");
}

export async function eliminarSondeo(id: string) {
  await prisma.sondeo.delete({ where: { id } });
  revalidatePath("/panel/sondeos");
}
