"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidar() {
  revalidatePath("/panel/mensajes");
  revalidatePath("/panel/envios");
}

export async function crearPlantilla(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const nombreMeta = String(formData.get("nombreMeta") ?? "").trim();
  const idioma = String(formData.get("idioma") ?? "es_AR").trim();
  const cuerpo = String(formData.get("cuerpo") ?? "").trim();
  const paramsPlantilla = String(formData.get("paramsPlantilla") ?? "").trim();
  const esDefault = formData.get("esDefault") === "on";

  if (!nombre || !nombreMeta || !cuerpo) return;

  if (esDefault) {
    await prisma.plantillaMensaje.updateMany({ data: { esDefault: false }, where: { esDefault: true } });
  }

  const maxOrden = await prisma.plantillaMensaje.aggregate({ _max: { orden: true } });

  await prisma.plantillaMensaje.create({
    data: {
      nombre,
      nombreMeta,
      idioma: idioma || "es_AR",
      cuerpo,
      paramsPlantilla,
      esDefault,
      orden: (maxOrden._max.orden ?? -1) + 1,
    },
  });
  revalidar();
}

export async function togglePlantilla(id: string, activa: boolean) {
  await prisma.plantillaMensaje.update({ where: { id }, data: { activa } });
  revalidar();
}

export async function marcarDefaultPlantilla(id: string) {
  await prisma.plantillaMensaje.updateMany({ data: { esDefault: false } });
  await prisma.plantillaMensaje.update({ where: { id }, data: { esDefault: true, activa: true } });
  revalidar();
}

export async function eliminarPlantilla(id: string) {
  await prisma.plantillaMensaje.delete({ where: { id } });
  revalidar();
}

export async function editarPlantillaCuerpo(id: string, cuerpo: string) {
  const texto = cuerpo.trim();
  if (!texto) return;
  await prisma.plantillaMensaje.update({ where: { id }, data: { cuerpo: texto } });
  revalidar();
}
