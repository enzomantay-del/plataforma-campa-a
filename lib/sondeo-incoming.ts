import { prisma } from "@/lib/prisma";
import { normalizarDestinatarioWa } from "@/lib/whatsapp-api";

/** Guarda mensajes de texto entrantes en el sondeo activo (si existe). */
export async function registrarRespuestaSondeo(params: {
  telefonoRaw: string;
  texto: string;
  waMessageId?: string;
}): Promise<boolean> {
  const activo = await prisma.sondeo.findFirst({ where: { activo: true } });
  if (!activo) return false;

  const telefono = normalizarDestinatarioWa(params.telefonoRaw);
  const texto = params.texto.trim();
  if (!telefono || !texto) return false;

  const clave = telefono.slice(-10);
  const contacto = await prisma.contacto.findFirst({
    where: { telefonoClave10: clave },
    select: { id: true },
  });

  await prisma.sondeoRespuesta.create({
    data: {
      sondeoId: activo.id,
      telefono,
      contactoId: contacto?.id,
      texto,
      waMessageId: params.waMessageId,
    },
  });

  return true;
}
