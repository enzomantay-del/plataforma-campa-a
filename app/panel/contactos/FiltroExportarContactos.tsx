"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Barrio = { id: string; nombre: string };

export function FiltroExportarContactos({
  barrios,
  barrioActual,
  total,
}: {
  barrios: Barrio[];
  barrioActual: string | null;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function cambiarBarrio(barrioId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (barrioId) params.set("barrio", barrioId);
    else params.delete("barrio");
    router.push(`/panel/contactos?${params.toString()}`);
  }

  const exportUrl = barrioActual
    ? `/api/contactos/export?barrioId=${encodeURIComponent(barrioActual)}`
    : "/api/contactos/export";

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <label className="block min-w-[200px] flex-1 text-sm">
        <span className="font-medium text-slate-700">Filtrar por barrio</span>
        <select
          value={barrioActual ?? ""}
          onChange={(e) => cambiarBarrio(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        >
          <option value="">Todos los barrios</option>
          {barrios.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold tabular-nums text-campana-azul">{total}</span> contacto
          {total === 1 ? "" : "s"}
        </p>
        <a
          href={exportUrl}
          download
          className="rounded-xl border border-campana-azul/30 bg-campana-azul/5 px-4 py-2 text-sm font-semibold text-campana-azul hover:bg-campana-azul/10"
        >
          Exportar CSV
        </a>
      </div>
    </div>
  );
}
