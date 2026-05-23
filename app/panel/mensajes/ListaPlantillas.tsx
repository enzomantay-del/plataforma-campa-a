"use client";

import { useState } from "react";
import { renderMensaje } from "@/lib/render-mensaje";
import { EditarPlantillaForm } from "./EditarPlantillaForm";
import { eliminarPlantilla, marcarDefaultPlantilla, togglePlantilla } from "./actions";

type Plantilla = {
  id: string;
  nombre: string;
  nombreMeta: string;
  idioma: string;
  cuerpo: string;
  paramsPlantilla: string;
  activa: boolean;
  esDefault: boolean;
};

export function ListaPlantillas({ plantillas }: { plantillas: Plantilla[] }) {
  const [editandoId, setEditandoId] = useState<string | null>(null);

  if (plantillas.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-slate-500">
        Todavía no hay plantillas. Creá una arriba para usarla en Envíos.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {plantillas.map((p) => {
        const preview = renderMensaje(p.cuerpo, {
          nombre: "María",
          apellido: "González",
          barrio: "Centro",
        });
        return (
          <li key={p.id} className="space-y-3 px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">
                  {p.nombre}
                  {p.esDefault ? (
                    <span className="ml-2 rounded-full bg-campana-azul/10 px-2 py-0.5 text-xs font-medium text-campana-azul">
                      Predeterminada
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  Meta: {p.nombreMeta} · {p.idioma}
                  {p.paramsPlantilla ? ` · vars: ${p.paramsPlantilla}` : ""}
                </p>
                <p className="mt-2 text-sm text-slate-700">{preview}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!p.esDefault ? (
                  <button
                    type="button"
                    onClick={() => void marcarDefaultPlantilla(p.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                  >
                    Predeterminada
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setEditandoId(editandoId === p.id ? null : p.id)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                >
                  {editandoId === p.id ? "Cerrar" : "Editar"}
                </button>
                <button
                  type="button"
                  onClick={() => void togglePlantilla(p.id, !p.activa)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                >
                  {p.activa ? "Desactivar" : "Activar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("¿Eliminar plantilla?")) void eliminarPlantilla(p.id);
                  }}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {editandoId === p.id ? (
              <EditarPlantillaForm plantilla={p} onCerrar={() => setEditandoId(null)} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
