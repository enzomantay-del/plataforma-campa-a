import { CoberturaBarrios } from "@/components/panel/CoberturaBarrios";
import { ResumenMetricas } from "@/components/panel/ResumenMetricas";
import { StatCard } from "@/components/panel/StatCard";
import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";
import { MARCA, MARCA_PANEL } from "@/lib/branding";
import { resumenGlobalMensajes } from "@/lib/metricas";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PanelInicioPage() {
  const [totalContactos, totalEnvios, totalReferentes, barriosConCount, metricas] =
    await Promise.all([
      prisma.contacto.count(),
      prisma.envio.count(),
      prisma.referente.count({ where: { activo: true } }),
      prisma.barrio.findMany({
        where: { activo: true },
        orderBy: BARRIOS_ORDER_BY,
        include: { _count: { select: { contactos: true } } },
      }),
      resumenGlobalMensajes(),
    ]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header className="rounded-2xl bg-gradient-to-br from-campana-azul via-campana-azul-med to-campana-azul-claro p-8 text-white shadow-panel">
        <p className="text-sm font-medium text-white/80">{MARCA.nombre} · {MARCA_PANEL.titulo}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {MARCA.subtitulo}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
          Formulario para referentes, avisos por WhatsApp, métricas de entrega y contactos por barrio.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/panel/carga-publica"
            className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-campana-azul shadow hover:bg-slate-50"
          >
            Link de carga →
          </Link>
          <Link
            href="/panel/envios"
            className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
          >
            Envíos
          </Link>
          <Link
            href="/panel/metricas"
            className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
          >
            Métricas
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard titulo="Contactos en base" valor={totalContactos} subtitulo="Vecinos cargados" />
        <StatCard titulo="Referentes activos" valor={totalReferentes} subtitulo="En formulario público" />
        <StatCard
          titulo="Envíos registrados"
          valor={totalEnvios}
          subtitulo="Lotes WhatsApp o simulados"
          acento="rojo"
        />
        <StatCard titulo="Barrios" valor={barriosConCount.length} subtitulo="Por barrio" />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-panel">
        <h3 className="text-lg font-bold text-campana-azul">WhatsApp · resumen global</h3>
        <p className="mt-1 text-sm text-slate-600">Recibidos y leídos (requiere webhook en producción).</p>
        <div className="mt-4">
          <ResumenMetricas resumen={metricas} compacto />
        </div>
        <Link href="/panel/metricas" className="mt-3 inline-block text-sm font-medium text-campana-azul-med hover:underline">
          Ver detalle por envío →
        </Link>
      </section>

      <CoberturaBarrios barrios={barriosConCount} />
    </div>
  );
}
