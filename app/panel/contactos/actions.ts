"use server";

import { crearContactoConDedupe } from "@/lib/contacto-create";
import { normalizarTelefono, telefonoClave10 } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function revalidarContactos() {
  revalidatePath("/panel");
  revalidatePath("/panel/contactos");
  revalidatePath("/panel/carga-publica");
  revalidatePath("/panel/envios");
}

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

  revalidarContactos();
  return { ok: true as const };
}

export async function editarContacto(id: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const telefonoRaw = String(formData.get("telefono") ?? "").trim();
  const barrioId = String(formData.get("barrioId") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (!nombre || !apellido || !barrioId) {
    return { ok: false as const, error: "Nombre, apellido y barrio son obligatorios." };
  }

  let clave: string;
  try {
    clave = telefonoClave10(telefonoRaw);
  } catch {
    return { ok: false as const, error: "Teléfono inválido." };
  }

  const barrio = await prisma.barrio.findFirst({ where: { id: barrioId, activo: true } });
  if (!barrio) {
    return { ok: false as const, error: "Barrio no válido." };
  }

  const duplicado = await prisma.contacto.findFirst({
    where: { telefonoClave10: clave, id: { not: id } },
  });
  if (duplicado) {
    return { ok: false as const, error: "Ese teléfono ya pertenece a otro contacto." };
  }

  await prisma.contacto.update({
    where: { id },
    data: {
      nombre,
      apellido,
      telefono: normalizarTelefono(telefonoRaw),
      telefonoClave10: clave,
      barrioId,
      notas: notas || null,
    },
  });

  revalidarContactos();
  return { ok: true as const };
}

export async function eliminarContacto(id: string) {
  await prisma.contacto.delete({ where: { id } });
  revalidarContactos();
  return { ok: true as const };
}
