"use client";

import { eliminarBarrio, renombrarBarrio, toggleBarrio } from "./actions";

export function BotonesBarrio({
  id,
  activo,
  nombre,
  contactos,
}: {
  id: string;
  activo: boolean;
  nombre: string;
  contactos: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          const nuevo = prompt("Nuevo nombre del barrio:", nombre);
          if (nuevo?.trim()) void renombrarBarrio(id, nuevo.trim());
        }}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
      >
        Renombrar
      </button>
      <button
        type="button"
        onClick={() => void toggleBarrio(id, !activo)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
      >
        {activo ? "Desactivar" : "Activar"}
      </button>
      <button
        type="button"
        onClick={() => {
          const msg =
            contactos > 0
              ? `Este barrio tiene ${contactos} contacto(s). Se desactivará (no se borra). ¿Continuar?`
              : "¿Eliminar barrio?";
          if (confirm(msg)) void eliminarBarrio(id);
        }}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700"
      >
        {contactos > 0 ? "Desactivar" : "Eliminar"}
      </button>
    </div>
  );
}
