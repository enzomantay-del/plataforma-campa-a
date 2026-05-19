import { prisma } from "@/lib/prisma";

export type ResumenMensajes = {
  total: number;
  enviado: number;
  entregado: number;
  leido: number;
  error: number;
  otros: number;
  tasaEntrega: number;
  tasaLectura: number;
};

const ENVIADO = new Set(["ENVIADO", "SIMULADO_OK"]);
const ENTREGADO = new Set(["ENTREGADO", "LEIDO"]);
const LEIDO = new Set(["LEIDO"]);
const ERROR = new Set(["ERROR"]);

export function calcularResumenMensajes(
  filas: { estado: string }[],
): ResumenMensajes {
  let enviado = 0;
  let entregado = 0;
  let leido = 0;
  let error = 0;
  let otros = 0;

  for (const f of filas) {
    const e = f.estado;
    if (LEIDO.has(e)) {
      leido++;
      entregado++;
      enviado++;
    } else if (ENTREGADO.has(e)) {
      entregado++;
      enviado++;
    } else if (ENVIADO.has(e)) {
      enviado++;
    } else if (ERROR.has(e)) {
      error++;
    } else {
      otros++;
    }
  }

  const total = filas.length;
  const tasaEntrega = total > 0 ? Math.round((entregado / total) * 1000) / 10 : 0;
  const tasaLectura = entregado > 0 ? Math.round((leido / entregado) * 1000) / 10 : 0;

  return {
    total,
    enviado,
    entregado,
    leido,
    error,
    otros,
    tasaEntrega,
    tasaLectura,
  };
}

export async function resumenGlobalMensajes(): Promise<ResumenMensajes> {
  const filas = await prisma.messageLog.findMany({ select: { estado: true } });
  return calcularResumenMensajes(filas);
}

export async function resumenPorEnvio(envioId: string): Promise<ResumenMensajes> {
  const filas = await prisma.messageLog.findMany({
    where: { envioId },
    select: { estado: true },
  });
  return calcularResumenMensajes(filas);
}

export type RankingReferente = {
  referenteId: string | null;
  nombre: string;
  cargados: number;
  entregados: number;
};

/** Contactos únicos por referente + cuántos tuvieron al menos un mensaje ENTREGADO/LEIDO. */
export async function rankingReferentes(): Promise<RankingReferente[]> {
  const contactos = await prisma.contacto.findMany({
    select: {
      id: true,
      referenteId: true,
      referente: { select: { nombre: true } },
      mensajes: { select: { estado: true }, take: 20 },
    },
  });

  const map = new Map<string, RankingReferente>();

  for (const c of contactos) {
    const key = c.referenteId ?? "__sin_referente__";
    const nombre = c.referente?.nombre ?? "Sin referente / panel";
    if (!map.has(key)) {
      map.set(key, { referenteId: c.referenteId, nombre, cargados: 0, entregados: 0 });
    }
    const row = map.get(key)!;
    row.cargados++;
    const ok = c.mensajes.some((m) => ENTREGADO.has(m.estado) || LEIDO.has(m.estado));
    if (ok) row.entregados++;
  }

  return Array.from(map.values()).sort((a, b) => b.cargados - a.cargados);
}
