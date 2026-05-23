"use client";

import { useState } from "react";
import { editarPlantilla } from "./actions";

type Plantilla = {
  id: string;
  nombre: string;
  nombreMeta: string;
  idioma: string;
  cuerpo: string;
  paramsPlantilla: string;
};

export function EditarPlantillaForm({ plantilla, onCerrar }: { plantilla: Plantilla; onCerrar: () => void }) {
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    try {
      const fd = new FormData(e.currentTarget);
      await editarPlantilla(plantilla.id, fd);
      onCerrar();
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={(ev) => void enviar(ev)} className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">Editar plantilla</p>
      <label className="block text-sm">
        <span className="text-slate-600">Nombre interno</span>
        <input
          name="nombre"
          required
          defaultValue={plantilla.nombre}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">Nombre Meta</span>
          <input
            name="nombreMeta"
            required
            defaultValue={plantilla.nombreMeta}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Idioma</span>
          <input
            name="idioma"
            required
            defaultValue={plantilla.idioma}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-sm"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-slate-600">Texto</span>
        <textarea
          name="cuerpo"
          required
          rows={3}
          defaultValue={plantilla.cuerpo}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Variables (orden Meta)</span>
        <input
          name="paramsPlantilla"
          defaultValue={plantilla.paramsPlantilla}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg bg-campana-azul px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {cargando ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCerrar} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
          Cancelar
        </button>
      </div>
    </form>
  );
}
