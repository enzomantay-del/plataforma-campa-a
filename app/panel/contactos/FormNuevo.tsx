"use client";

import { useRef, useState } from "react";
import { crearContacto } from "./actions";

type Barrio = { id: string; nombre: string };

export function FormNuevoContacto({ barrios }: { barrios: Barrio[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <form
      ref={ref}
      action={async (fd) => {
        setMsg(null);
        const r = await crearContacto(fd);
        if (r.ok) {
          ref.current?.reset();
          setMsg("Contacto guardado.");
        } else {
          setMsg(r.error ?? "Error al guardar.");
        }
      }}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h3 className="font-bold text-campana-azul">Alta rápida (panel)</h3>
        <p className="text-xs text-slate-500">Nombre, apellido, teléfono y barrio obligatorios.</p>
      </div>
      <label className="block text-sm">
        <span className="text-slate-600">Nombre</span>
        <input
          name="nombre"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Apellido</span>
        <input
          name="apellido"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Teléfono</span>
        <input
          name="telefono"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
          placeholder="3764… o +549…"
        />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Barrio</span>
        <select
          name="barrioId"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        >
          <option value="">Elegí…</option>
          {barrios.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-slate-600">Notas (opcional)</span>
        <input
          name="notas"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-xl bg-campana-rojo px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
        >
          Guardar contacto
        </button>
        {msg ? <p className="mt-2 text-sm text-slate-600">{msg}</p> : null}
      </div>
    </form>
  );
}
