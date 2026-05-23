"use client";

import { useState } from "react";
import { editarContacto, eliminarContacto } from "./actions";

type Barrio = { id: string; nombre: string };

type Contacto = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  barrioId: string;
  notas: string | null;
};

export function BotonesContacto({
  contacto,
  barrios,
}: {
  contacto: Contacto;
  barrios: Barrio[];
}) {
  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setCargando(true);
    try {
      const fd = new FormData(e.currentTarget);
      const r = await editarContacto(contacto.id, fd);
      if (r.ok) {
        setEditando(false);
      } else {
        setMsg(r.error ?? "No se pudo guardar.");
      }
    } finally {
      setCargando(false);
    }
  }

  if (editando) {
    return (
      <form
        onSubmit={(e) => void guardar(e)}
        className="min-w-[280px] space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left"
      >
        <div className="grid grid-cols-2 gap-2">
          <input
            name="nombre"
            defaultValue={contacto.nombre}
            required
            placeholder="Nombre"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
          />
          <input
            name="apellido"
            defaultValue={contacto.apellido}
            required
            placeholder="Apellido"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
          />
        </div>
        <input
          name="telefono"
          defaultValue={contacto.telefono}
          required
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs"
        />
        <select
          name="barrioId"
          defaultValue={contacto.barrioId}
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
        >
          {barrios.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
        <input
          name="notas"
          defaultValue={contacto.notas ?? ""}
          placeholder="Notas"
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
        />
        {msg ? <p className="text-xs text-red-700">{msg}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={cargando}
            className="rounded-lg bg-campana-azul px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
          >
            {cargando ? "…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditando(false);
              setMsg(null);
            }}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="text-xs font-medium text-campana-azul hover:underline"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm("¿Eliminar este contacto de la base?")) void eliminarContacto(contacto.id);
        }}
        className="text-xs font-medium text-campana-rojo hover:underline"
      >
        Eliminar
      </button>
    </div>
  );
}
