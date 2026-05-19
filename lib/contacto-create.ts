import { prisma } from "@/lib/prisma";
import { normalizarTelefono, telefonoClave10 } from "@/lib/phone";

export type CrearContactoInput = {
  nombre: string;
  apellido: string;
  telefono: string;
  barrioId: string;
  referenteId?: string | null;
  notas?: string | null;
};

export type CrearContactoResult =
  | { ok: true; id: string; duplicado: false }
  | {
      ok: false;
      duplicado: true;
      mensaje: string;
      existente: {
        nombre: string;
        apellido: string;
        barrio: string;
        referente: string | null;
      };
    }
  | { ok: false; duplicado: false; error: string };

export async function crearContactoConDedupe(input: CrearContactoInput): Promise<CrearContactoResult> {
  const nombre = input.nombre.trim();
  const apellido = input.apellido.trim();
  const barrioId = input.barrioId.trim();

  if (!nombre || !apellido || !barrioId) {
    return { ok: false, duplicado: false, error: "Nombre, apellido y barrio son obligatorios." };
  }

  let clave: string;
  try {
    clave = telefonoClave10(input.telefono);
  } catch {
    return { ok: false, duplicado: false, error: "Teléfono inválido. Revisá el número." };
  }

  const existente = await prisma.contacto.findUnique({
    where: { telefonoClave10: clave },
    include: {
      barrio: { select: { nombre: true } },
      referente: { select: { nombre: true } },
    },
  });

  if (existente) {
    return {
      ok: false,
      duplicado: true,
      mensaje: "Este contacto ya está en la base.",
      existente: {
        nombre: existente.nombre,
        apellido: existente.apellido,
        barrio: existente.barrio.nombre,
        referente: existente.referente?.nombre ?? null,
      },
    };
  }

  const barrio = await prisma.barrio.findFirst({ where: { id: barrioId, activo: true } });
  if (!barrio) {
    return { ok: false, duplicado: false, error: "Barrio no válido." };
  }

  if (input.referenteId) {
    const ref = await prisma.referente.findFirst({
      where: { id: input.referenteId, activo: true },
    });
    if (!ref) {
      return { ok: false, duplicado: false, error: "Referente no válido." };
    }
  }

  const creado = await prisma.contacto.create({
    data: {
      nombre,
      apellido,
      telefono: normalizarTelefono(input.telefono),
      telefonoClave10: clave,
      barrioId,
      referenteId: input.referenteId || null,
      notas: input.notas?.trim() || null,
    },
  });

  return { ok: true, id: creado.id, duplicado: false };
}
