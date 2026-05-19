import { ResumenMetricas } from "@/components/panel/ResumenMetricas";
import { calcularResumenMensajes } from "@/lib/metricas";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

function badge(estado: string) {
  const base = "rounded-full px-2 py-0.5 text-xs font-medium";
  if (estado === "ERROR") return `${base} bg-red-50 text-red-800`;
  if (estado === "LEIDO") return `${base} bg-blue-50 text-blue-800`;
  if (estado === "ENTREGADO" || estado === "ENVIADO" || estado === "SIMULADO_OK")
    return `${base} bg-emerald-50 text-emerald-800`;
  return `${base} bg-slate-100 text-slate-800`;
}

export default async function EnvioDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const envio = await prisma.envio.findUnique({
    where: { id },
    include: {
      mensajes: {
        include: {
          contacto: {
            select: {
              nombre: true,
              apellido: true,
              telefono: true,
              barrio: { select: { nombre: true } },
            },
          },
        },
        orderBy: { actualizadoEn: "desc" },
      },
    },
  });

  if (!envio) notFound();

  const resumen = calcularResumenMensajes(envio.mensajes);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Link href="/panel/envios" className="text-sm font-medium text-campana-azul-med hover:underline">
        ← Volver a envíos
      </Link>
      <header>
        <h2 className="text-2xl font-bold text-campana-azul">{envio.nombre}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {envio.descripcion || "Sin descripción"} · Barrio: {envio.filtroBarrio ?? "todos"} · Estado:{" "}
          <span className="font-semibold">{envio.estado}</span>
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <ResumenMetricas resumen={resumen} />
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Barrio</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envio.mensajes.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">
                      {m.contacto.nombre} {m.contacto.apellido}
                    </span>
                    <br />
                    <span className="font-mono text-xs text-slate-500">{m.contacto.telefono}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.contacto.barrio.nombre}</td>
                  <td className="px-4 py-3">
                    <span className={badge(m.estado)}>{m.estado}</span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-500" title={m.detalle ?? ""}>
                    {m.detalle || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
