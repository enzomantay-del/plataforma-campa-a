"use client";

import { eliminarContacto } from "./actions";

export function BotonEliminar({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("¿Eliminar este contacto de la base?")) void eliminarContacto(id);
      }}
      className="text-xs font-medium text-campana-rojo hover:underline"
    >
      Eliminar
    </button>
  );
}
