"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  barrios: string[];
  whatsappListo: boolean;
  plantillaDefault: string;
  idiomaDefault: string;
};

export function FormEnvioWhatsApp({ barrios, whatsappListo, plantillaDefault, idiomaDefault }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [barrio, setBarrio] = useState("");
  const [plantilla, setPlantilla] = useState(plantillaDefault);
  const [idioma, setIdioma] = useState(idiomaDefault);
  const [varsCuerpo, setVarsCuerpo] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

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

  return (
    <div className="rounded-2xl border border-campana-azul/20 bg-gradient-to-br from-white to-slate-50 p-6 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-campana-azul">Envío real · WhatsApp Cloud API</h3>
          <p className="mt-2 text-sm text-slate-600">
            Usa una <strong>plantilla aprobada</strong> en tu cuenta de Meta. Costos y límites según tu
            contrato con Meta.
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
          Cargá en <code className="rounded bg-amber-100/80 px-1">.env</code> al menos{" "}
          <code className="rounded bg-amber-100/80 px-1">WHATSAPP_ACCESS_TOKEN</code> y{" "}
          <code className="rounded bg-amber-100/80 px-1">WHATSAPP_PHONE_NUMBER_ID</code>. Mirá la guía en{" "}
          <strong>Configuración</strong>.
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Nombre del lote (opcional)</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
            placeholder="Ej. Cierre de campaña"
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
          <span className="text-slate-600">
            Variables del cuerpo (opcional, separadas por comas — mismo orden que en la plantilla Meta)
          </span>
          <input
            value={varsCuerpo}
            onChange={(e) => setVarsCuerpo(e.target.value)}
            disabled={!whatsappListo || cargando}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2 disabled:opacity-50"
            placeholder='Vacío para plantillas sin variables (ej. hello_world). Ej: "Ana", "Centro"'
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
