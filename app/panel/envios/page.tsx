import {
  getDefaultTemplateLanguage,
  getDefaultTemplateName,
  isWhatsAppConfigured,
} from "@/lib/whatsapp-config";
import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FormEnvioWhatsApp } from "./FormEnvioWhatsApp";
import { FormSimularEnvio } from "./FormSimular";

function badgeEnvio(estado: string) {
  const base = "rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (estado === "ERROR" || estado === "error") return `${base} bg-red-50 text-red-800`;
  if (estado === "COMPLETADO" || estado === "SIMULADO") return `${base} bg-emerald-50 text-emerald-800`;
  if (estado === "PARCIAL" || estado === "ENVIANDO") return `${base} bg-amber-50 text-amber-900`;
  return `${base} bg-slate-100 text-slate-800`;
}

export default async function EnviosPage() {
  const barrios = await prisma.barrio.findMany({
    where: { activo: true },
    orderBy: BARRIOS_ORDER_BY,
    select: { nombre: true },
  });

  let plantillas: Awaited<ReturnType<typeof prisma.plantillaMensaje.findMany>> = [];
  try {
    plantillas = await prisma.plantillaMensaje.findMany({
      where: { activa: true },
      orderBy: [{ esDefault: "desc" }, { orden: "asc" }],
    });
  } catch {
    plantillas = [];
  }

  const contactos = await prisma.contacto.findMany({
    orderBy: [{ barrio: BARRIOS_ORDER_BY }, { apellido: "asc" }, { nombre: "asc" }],
    select: {
      id: true,
      nombre: true,
      apellido: true,
      barrio: { select: { nombre: true } },
    },
  });

  const envios = await prisma.envio.findMany({
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { mensajes: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Envíos</h2>
        <p className="mt-1 text-sm text-slate-600">
          <strong>Fase 2:</strong> envío real con plantilla aprobada (Meta). <strong>Fase 1:</strong> simulación local
          sin costo.
        </p>
      </div>

      <FormEnvioWhatsApp
        barrios={barrios.map((b) => b.nombre)}
        contactos={contactos.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          apellido: c.apellido,
          barrio: c.barrio.nombre,
        }))}
        whatsappListo={isWhatsAppConfigured()}
        plantillaDefault={getDefaultTemplateName()}
        idiomaDefault={getDefaultTemplateLanguage()}
        plantillas={plantillas}
      />

      <FormSimularEnvio barrios={barrios.map((b) => b.nombre)} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-campana-azul">Historial de lotes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Filtro barrio</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Mensajes</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Todavía no registraste envíos. Simulá uno arriba.
                  </td>
                </tr>
              ) : (
                envios.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{e.filtroBarrio ?? "— Todos —"}</td>
                    <td className="px-4 py-3">
                      <span className={badgeEnvio(e.estado)}>{e.estado}</span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{e._count.mensajes}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {e.creadoEn.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/panel/envios/${e.id}`}
                        className="text-sm font-medium text-campana-azul-med hover:underline"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
