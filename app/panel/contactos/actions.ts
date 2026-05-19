"use server";

import { crearContactoConDedupe } from "@/lib/contacto-create";
import { revalidatePath } from "next/cache";

export async function crearContacto(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const barrioId = String(formData.get("barrioId") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();
  const referenteId = String(formData.get("referenteId") ?? "").trim() || null;

  const result = await crearContactoConDedupe({
    nombre,
    apellido,
    telefono,
    barrioId,
    referenteId,
    notas,
  });

  if (!result.ok) {
    return {
      ok: false as const,
      error: result.duplicado ? result.mensaje : result.error,
      duplicado: result.duplicado,
    };
  }

  revalidatePath("/panel");
  revalidatePath("/panel/contactos");
  revalidatePath("/panel/carga-publica");
  return { ok: true as const };
}

export async function eliminarContacto(id: string) {
  const { prisma } = await import("@/lib/prisma");
  await prisma.contacto.delete({ where: { id } });
  revalidatePath("/panel");
  revalidatePath("/panel/contactos");
  revalidatePath("/panel/carga-publica");
  return { ok: true as const };
}
