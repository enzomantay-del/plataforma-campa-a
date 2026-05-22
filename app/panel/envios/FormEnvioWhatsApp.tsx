"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { renderMensaje } from "@/lib/render-mensaje";

type Plantilla = {
  id: string;
  nombre: string;
  nombreMeta: string;
  idioma: string;
  cuerpo: string;
  paramsPlantilla: string;
  esDefault: boolean;
};

type Props = {
  barrios: string[];
  whatsappListo: boolean;
  plantillaDefault: string;
  idiomaDefault: string;
  plantillas: Plantilla[];
};

export function FormEnvioWhatsApp({
  barrios,
  whatsappListo,
  plantillaDefault,
  idiomaDefault,
  plantillas,
}: Props) {
  const router = useRouter();
  const defaultP = plantillas.find((p) => p.esDefault) ?? plantillas[0];
  const [plantillaId, setPlantillaId] = useState(defaultP?.id ?? "");
  const [nombre, setNombre] = useState("");
  const [barrio, setBarrio] = useState("");
  const [plantilla, setPlantilla] = useState(defaultP?.nombreMeta ?? plantillaDefault);
  const [idioma, setIdioma] = useState(defaultP?.idioma ?? idiomaDefault);
  const [varsCuerpo, setVarsCuerpo] = useState(defaultP?.paramsPlantilla ?? "");
  const [cuerpoPreview, setCuerpoPreview] = useState(defaultP?.cuerpo ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function elegirPlantilla(id: string) {
    setPlantillaId(id);
    const p = plantillas.find((x) => x.id === id);
    if (!p) return;
    setPlantilla(p.nombreMeta);
    setIdioma(p.idioma);
    setVarsCuerpo(p.paramsPlantilla);
    setCuerpoPreview(p.cuerpo);
  }

  async function enviar() {
    setMsg(null);
    setCargando(true);
    try {
      const partes = varsCuerpo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const bodyParams = partes.length > 0 ? partes : undefined;

      const res = await fetch("/api/envios/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim() || undefined,
          filtroBarrio: barrio.trim() || null,
          templateName: plantilla.trim() || undefined,
          languageCode: idioma.trim() || undefined,
          bodyParams,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        exitosos?: number;
        fallidos?: number;
        estadoFinal?: string;
      };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "No se pudo enviar.");
        return;
      }
      setMsg(
        `Lote ${data.estadoFinal}: ${data.exitosos} enviados, ${data.fallidos} con error. Los estados se actualizarán vía webhook cuando Meta confirme.`,
      );
      setNombre("");
      router.refresh();
    } finally {
      setCargando(false);
    }
  }

  const preview = renderMensaje(cuerpoPreview, {
    nombre: "María",
    apellido: "González",
    barrio: barrio || "Centro",
  });

  return (
    <div className="rounded-2xl border border-campana-azul/20 bg-gradient-to-br from-white to-slate-50 p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-campana-azul">Envío real · WhatsApp Cloud API</h3>
          <p className="mt-2 text-sm text-slate-600">
            Elegí una plantilla diseñada en <strong>Mensajes</strong>. Debe estar aprobada en Meta.
          </p>
        </div>
        <span
          className={
            whatsappListo
              ? "shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
              : "shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900"
          }
        >
          {whatsappListo ? "API configurada" : "Falta configurar .env"}
        </span>
      </div>

      {!whatsappListo ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
          Configurá WhatsApp en <strong>Configuración</strong> o variables en Netlify.
        </p>
      ) : null}

      {plantillas.length > 0 ? (
        <label className="mt-4 block text-sm">
          <span className="text-slate-600">Plantilla guardada</span>
          <select
            value={plantillaId}
            onChange={(e) => elegirPlantilla(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
          >
            {plantillas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
                {p.esDefault ? " (predeterminada)" : ""}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          Creá plantillas en <strong>Mensajes</strong> para precargar el diseño acá.
        </p>
      )}

      {cuerpoPreview ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Vista previa</p>
          <p className="mt-2 whitespace-pre-wrap">{preview}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Nombre del lote (opcional)</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
            placeholder="Ej. Aviso bacheos San Martín"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Plantilla (nombre exacto en Meta)</span>
          <input
            value={plantilla}
            onChange={(e) => setPlantilla(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Idioma (locale Meta)</span>
          <input
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
            placeholder="es_AR · en_US"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Variables del cuerpo (separadas por comas)</span>
          <input
            value={varsCuerpo}
            onChange={(e) => setVarsCuerpo(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
            placeholder="{{nombre}}, {{barrio}}"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Solo barrio (vacío = todos los contactos)</span>
          <select
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
          >
            <option value="">Todos</option>
            {barrios.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={!whatsappListo || cargando}
        onClick={() => void enviar()}
        className="mt-5 rounded-xl bg-campana-azul px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-campana-azul-med disabled:cursor-not-allowed disabled:opacity-40"
      >
        {cargando ? "Enviando…" : "Enviar plantilla por WhatsApp"}
      </button>
      {msg ? <p className="mt-3 text-sm text-slate-700">{msg}</p> : null}
    </div>
  );
}
