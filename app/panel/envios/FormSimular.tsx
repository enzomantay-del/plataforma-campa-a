"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FormSimularEnvio({ barrios }: { barrios: string[] }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [barrio, setBarrio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function simular() {
    setMsg(null);
    const res = await fetch("/api/envios/simular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre.trim() || undefined,
        filtroBarrio: barrio.trim() || null,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      destinatarios?: number;
    };
    if (!res.ok || !data.ok) {
      setMsg(data.error ?? "Error al simular.");
      return;
    }
    setMsg(`Simulación lista: ${data.destinatarios} mensajes registrados.`);
    setNombre("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <h3 className="font-bold text-campana-azul">Simulación (sin Meta)</h3>
      <p className="mt-2 text-sm text-slate-600">
        Registra un lote en la base <strong>sin</strong> llamar a la API. Útil para capacitación o demos sin
        costo.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">Nombre del lote (opcional)</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
            placeholder="Ej. Convocatoria acto viernes"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Solo barrio (vacío = todos)</span>
          <select
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
          >
            <option value="">Todos los contactos</option>
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
        onClick={() => void simular()}
        className="mt-5 rounded-xl bg-campana-rojo px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
      >
        Registrar simulación
      </button>
      {msg ? <p className="mt-3 text-sm text-slate-700">{msg}</p> : null}
    </div>
  );
}
