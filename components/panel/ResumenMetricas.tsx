import type { ResumenMensajes } from "@/lib/metricas";

export function ResumenMetricas({ resumen, compacto }: { resumen: ResumenMensajes; compacto?: boolean }) {
  const items = [
    { label: "Total", valor: resumen.total, color: "text-slate-800" },
    { label: "Enviados", valor: resumen.enviado, color: "text-slate-700" },
    { label: "Recibidos", valor: resumen.entregado, color: "text-emerald-700" },
    { label: "Leídos", valor: resumen.leido, color: "text-blue-700" },
    { label: "Errores", valor: resumen.error, color: "text-red-700" },
  ];

  return (
    <div className={compacto ? "space-y-2" : "space-y-3"}>
      <div className={`grid gap-2 ${compacto ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-5"}`}>
        {items.map((it) => (
          <div key={it.label} className="rounded-xl bg-slate-50 px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{it.label}</p>
            <p className={`text-lg font-bold tabular-nums ${it.color}`}>{it.valor}</p>
          </div>
        ))}
      </div>
      {!compacto ? (
        <p className="text-xs text-slate-500">
          Tasa de entrega (recibidos / total): <strong>{resumen.tasaEntrega}%</strong> · Tasa de lectura (leídos /
          recibidos): <strong>{resumen.tasaLectura}%</strong>
        </p>
      ) : null}
    </div>
  );
}
