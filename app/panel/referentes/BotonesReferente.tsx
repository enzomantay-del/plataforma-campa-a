"use client";

import { eliminarReferente, toggleReferente } from "./actions";

export function BotonesReferente({ id, activo }: { id: string; activo: boolean }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => void toggleReferente(id, !activo)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
      >
        {activo ? "Desactivar" : "Activar"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm("¿Eliminar referente? Los contactos quedan sin referente asignado.")) void eliminarReferente(id);
        }}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700"
      >
        Eliminar
      </button>
    </div>
  );
}
