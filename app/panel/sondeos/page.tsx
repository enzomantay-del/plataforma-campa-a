import { prisma } from "@/lib/prisma";
import { BotonesSondeo } from "./BotonesSondeo";
import { FormNuevoSondeo } from "./FormNuevoSondeo";

export default async function SondeosPage() {
  const sondeos = await prisma.sondeo.findMany({
    orderBy: { creadoEn: "desc" },
    include: {
      _count: { select: { respuestas: true } },
      respuestas: {
        orderBy: { recibidoEn: "desc" },
        take: 8,
      },
    },
  });

  const activo = sondeos.find((s) => s.activo);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Sondeos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Recibí respuestas por WhatsApp. Activá un sondeo, pedile a la gente que conteste por mensaje y las
          respuestas aparecen acá.
        </p>
        {activo ? (
          <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <strong>Activo ahora:</strong> {activo.titulo} — «{activo.pregunta}»
          </p>
        ) : (
          <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            No hay sondeo activo. Creá uno y tocá <strong>Activar</strong>.
          </p>
        )}
      </div>

      <FormNuevoSondeo />

      <div className="space-y-6">
        {sondeos.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay sondeos.</p>
        ) : (
          sondeos.map((s) => (
            <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-campana-azul">{s.titulo}</h3>
                    {s.activo ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        ACTIVO
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{s.pregunta}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {s._count.respuestas} respuesta{s._count.respuestas === 1 ? "" : "s"} ·{" "}
                    {s.creadoEn.toLocaleString("es-AR", { dateStyle: "short" })}
                  </p>
                </div>
                <BotonesSondeo id={s.id} activo={s.activo} />
              </div>
              {s.respuestas.length > 0 ? (
                <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {s.respuestas.map((r) => (
                    <li key={r.id} className="px-4 py-3 text-sm">
                      <span className="font-mono text-xs text-slate-500">{r.telefono}</span>
                      <p className="mt-1 text-slate-800">{r.texto}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {r.recibidoEn.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
