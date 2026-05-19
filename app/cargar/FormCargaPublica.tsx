"use client";

import { useState } from "react";

type Barrio = { id: string; nombre: string };
type Referente = { id: string; nombre: string };

export function FormCargaPublica({
  barrios,
  referentes,
  keyQuery,
}: {
  barrios: Barrio[];
  referentes: Referente[];
  keyQuery: string;
}) {
  const [msg, setMsg] = useState<{ tipo: "ok" | "dup" | "err"; texto: string; extra?: string } | null>(
    null,
  );
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setCargando(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/public/contactos${keyQuery}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: fd.get("nombre"),
          apellido: fd.get("apellido"),
          telefono: fd.get("telefono"),
          barrioId: fd.get("barrioId"),
          referenteId: fd.get("referenteId"),
          notas: fd.get("notas"),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        duplicado?: boolean;
        error?: string;
        existente?: { nombre: string; apellido: string; barrio: string; referente: string | null };
      };

      if (data.duplicado && data.existente) {
        const ex = data.existente;
        setMsg({
          tipo: "dup",
          texto: "Este contacto ya está en la base.",
          extra: `${ex.nombre} ${ex.apellido} · ${ex.barrio}${ex.referente ? ` · cargado por ${ex.referente}` : ""}`,
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setMsg({ tipo: "err", texto: data.error ?? "No se pudo guardar." });
        return;
      }

      setMsg({ tipo: "ok", texto: "¡Listo! Contacto cargado correctamente." });
      e.currentTarget.reset();
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={(ev) => void enviar(ev)}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel"
    >
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Tu nombre (referente) *</span>
        {referentes.length === 0 ? (
          <p className="mt-2 text-sm text-amber-800">
            Todavía no hay referentes en el sistema. Pedí a coordinación que los den de alta en el panel.
          </p>
        ) : (
          <select
            name="referenteId"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
          >
            <option value="">Elegí…</option>
            {referentes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Nombre *</span>
          <input
            name="nombre"
            required
            autoComplete="given-name"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Apellido *</span>
          <input
            name="apellido"
            required
            autoComplete="family-name"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Teléfono WhatsApp *</span>
        <input
          name="telefono"
          required
          inputMode="tel"
          placeholder="Ej. 3764 123456 o 5493764123456"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Barrio del contacto *</span>
        <select
          name="barrioId"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
        >
          <option value="">Elegí barrio…</option>
          {barrios.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Notas (opcional)</span>
        <input
          name="notas"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none ring-campana-azul-claro focus:ring-2"
          placeholder="Referencia, manzana, etc."
        />
      </label>

      <button
        type="submit"
        disabled={cargando || referentes.length === 0}
        className="w-full rounded-xl bg-campana-azul py-4 text-base font-semibold text-white hover:bg-campana-azul-med disabled:opacity-50"
      >
        {cargando ? "Guardando…" : "Cargar contacto"}
      </button>

      {msg ? (
        <div
          className={
            msg.tipo === "ok"
              ? "rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"
              : msg.tipo === "dup"
                ? "rounded-xl bg-amber-50 p-4 text-sm text-amber-950"
                : "rounded-xl bg-red-50 p-4 text-sm text-red-900"
          }
        >
          <p className="font-semibold">{msg.texto}</p>
          {msg.extra ? <p className="mt-1 text-xs opacity-90">{msg.extra}</p> : null}
          {msg.tipo === "ok" ? (
            <p className="mt-2 text-xs">Podés cargar otro contacto abajo.</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
