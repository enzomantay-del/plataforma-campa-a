import { ResumenMetricas } from "@/components/panel/ResumenMetricas";
import { calcularResumenMensajes, resumenGlobalMensajes } from "@/lib/metricas";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MetricasPage() {
  const global = await resumenGlobalMensajes();

  const envios = await prisma.envio.findMany({
    orderBy: { creadoEn: "desc" },
    take: 20,
    include: {
      mensajes: { select: { estado: true } },
      _count: { select: { mensajes: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Métricas de mensajes</h2>
        <p className="mt-1 text-sm text-slate-600">
          Recibido = llegó al celular (ENTREGADO). Leído = tilde azul (LEIDO). Requiere webhook configurado en Meta.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h3 className="font-semibold text-campana-azul">Resumen global</h3>
        <div className="mt-4">
          <ResumenMetricas resumen={global} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-campana-azul">Por lote de envío</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Envío</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
                <th className="px-4 py-3 font-semibold text-right">Recibidos</th>
                <th className="px-4 py-3 font-semibold text-right">Leídos</th>
                <th className="px-4 py-3 font-semibold text-right">Errores</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Todavía no hay envíos con mensajes registrados.
                  </td>
                </tr>
              ) : (
                envios.map((e) => {
                  const r = calcularResumenMensajes(e.mensajes);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium">{e.nombre}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {e.creadoEn.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.total}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-700">{r.entregado}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-blue-700">{r.leido}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-red-700">{r.error}</td>
                      <td className="px-4 py-3">
                        <Link href={`/panel/envios/${e.id}`} className="text-campana-azul-med hover:underline">
                          Detalle
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
