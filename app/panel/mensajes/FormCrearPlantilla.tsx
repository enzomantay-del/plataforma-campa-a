"use client";

import { useState } from "react";
import { VistaPreviaMensaje } from "./VistaPreviaMensaje";
import { crearPlantilla } from "./actions";

export function FormCrearPlantilla() {
  const [cuerpo, setCuerpo] = useState(
    "Hola {{nombre}}, te contactamos desde la campaña de tu barrio {{barrio}}.",
  );
  const [paramsPlantilla, setParamsPlantilla] = useState("{{nombre}}, {{barrio}}");
  const [guardando, setGuardando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    try {
      const fd = new FormData(e.currentTarget);
      await crearPlantilla(fd);
      e.currentTarget.reset();
      setCuerpo("Hola {{nombre}}, te contactamos desde la campaña de tu barrio {{barrio}}.");
      setParamsPlantilla("{{nombre}}, {{barrio}}");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={(ev) => void enviar(ev)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
    >
      <h3 className="font-semibold text-campana-azul">Nueva plantilla de mensaje</h3>
      <p className="text-sm text-slate-600">
        El texto se usa como guía y vista previa. En WhatsApp debe existir una plantilla con el mismo{" "}
        <strong>nombre Meta</strong>, aprobada en tu cuenta.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Nombre interno</span>
          <input
            name="nombre"
            required
            placeholder="Ej. Saludo barrio"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Nombre plantilla Meta</span>
          <input
            name="nombreMeta"
            required
            defaultValue="hello_world"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none ring-campana-azul-claro focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Idioma Meta</span>
          <input
            name="idioma"
            defaultValue="es_AR"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none ring-campana-azul-claro focus:ring-2"
            placeholder="es_AR · en_US"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Texto del mensaje (diseño)</span>
          <textarea
            name="cuerpo"
            required
            rows={4}
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
          />
        </label>
        <div className="sm:col-span-2">
          <VistaPreviaMensaje cuerpo={cuerpo} />
        </div>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">
            Variables Meta (orden, separadas por coma — mismo orden que en la plantilla aprobada)
          </span>
          <input
            name="paramsPlantilla"
            value={paramsPlantilla}
            onChange={(e) => setParamsPlantilla(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
            placeholder="{{nombre}}, {{barrio}}"
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="esDefault" className="rounded border-slate-300" />
          Usar como plantilla predeterminada en Envíos
        </label>
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="rounded-xl bg-campana-rojo px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {guardando ? "Guardando…" : "Guardar plantilla"}
      </button>
    </form>
  );
}
