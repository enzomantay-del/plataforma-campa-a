"use client";

import { activarSondeo, desactivarSondeo, eliminarSondeo } from "./actions";

export function BotonesSondeo({ id, activo }: { id: string; activo: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {activo ? (
        <button
          type="button"
          onClick={() => void desactivarSondeo(id)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
        >
          Desactivar
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void activarSondeo(id)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Activar
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (confirm("¿Eliminar este sondeo y todas sus respuestas?")) void eliminarSondeo(id);
        }}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
      >
        Eliminar
      </button>
    </div>
  );
}
