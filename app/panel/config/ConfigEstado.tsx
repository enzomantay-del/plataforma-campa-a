"use client";

import { useState } from "react";

type EstadoInicial = {
  configurado: boolean;
  verifyToken: boolean;
  urlWebhook: string;
};

export function ConfigEstado({ inicial }: { inicial: EstadoInicial }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [detalle, setDetalle] = useState<string | null>(null);

  async function probar() {
    setMsg(null);
    setDetalle(null);
    setCargando(true);
    try {
      const res = await fetch("/api/whatsapp/test", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        displayPhone?: string;
        verifiedName?: string;
        configurado?: boolean;
        verifyTokenDefinido?: boolean;
      };
      if (!data.configurado) {
        setMsg(data.error ?? "WhatsApp no configurado.");
        return;
      }
      if (data.ok) {
        const partes = [
          data.verifiedName ? `Cuenta: ${data.verifiedName}` : null,
          data.displayPhone ? `Número: ${data.displayPhone}` : null,
        ].filter(Boolean);
        setMsg("Conexión con Meta correcta.");
        setDetalle(partes.join(" · ") || "Token y número válidos.");
      } else {
        const err = data.error ?? "Meta rechazó la conexión. Revisá el token (una sola línea en .env).";
        setMsg(err);
        if (/expired|expiró|caduc/i.test(err)) {
          setDetalle(
            "El token de Meta venció. En developers.facebook.com → WhatsApp → API Setup → Generar token de acceso, pegalo en .env y reiniciá iniciar-panel.bat.",
          );
        }
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <h3 className="font-semibold text-campana-azul">Estado actual</h3>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <span
            className={
              inicial.configurado
                ? "inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"
                : "inline-block h-2.5 w-2.5 rounded-full bg-amber-500"
            }
          />
          {inicial.configurado
            ? "Variables mínimas cargadas (token + ID de número)"
            : "Faltan token o ID de número en .env"}
        </li>
        <li className="flex items-center gap-2">
          <span
            className={
              inicial.verifyToken
                ? "inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"
                : "inline-block h-2.5 w-2.5 rounded-full bg-slate-300"
            }
          />
          {inicial.verifyToken
            ? "WHATSAPP_VERIFY_TOKEN definido (listo para webhook)"
            : "Falta WHATSAPP_VERIFY_TOKEN (necesario para webhook)"}
        </li>
      </ul>
      <p className="mt-4 break-all font-mono text-xs text-slate-500">
        Webhook: <span className="text-slate-700">{inicial.urlWebhook}</span>
      </p>
      <button
        type="button"
        onClick={() => void probar()}
        disabled={!inicial.configurado || cargando}
        className="mt-5 rounded-xl bg-campana-azul px-4 py-2.5 text-sm font-semibold text-white hover:bg-campana-azul-med disabled:cursor-not-allowed disabled:opacity-40"
      >
        {cargando ? "Probando…" : "Probar conexión con Meta"}
      </button>
      {msg ? (
        <p className={`mt-3 text-sm ${msg.includes("correcta") ? "text-emerald-800" : "text-red-800"}`}>{msg}</p>
      ) : null}
      {detalle ? <p className="mt-1 text-xs text-slate-600">{detalle}</p> : null}
    </div>
  );
}
