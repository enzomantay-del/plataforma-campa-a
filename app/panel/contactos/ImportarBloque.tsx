"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Barrio = { id: string; nombre: string };

export function ImportarBloque({ barrios }: { barrios: Barrio[] }) {
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function enviar() {
    setMsg(null);
    const res = await fetch("/api/contactos/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      importados?: number;
      duplicados?: number;
    };
    if (!res.ok || !data.ok) {
      setMsg(data.error ?? "No se pudo importar.");
      return;
    }
    setMsg(
      `Listo: ${data.importados} nuevos${data.duplicados ? `, ${data.duplicados} duplicados omitidos` : ""}.`,
    );
    setTexto("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-dashed border-campana-azul-claro/40 bg-white p-5 shadow-panel">
      <h3 className="font-bold text-campana-azul">Importación por texto</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        Una fila: <code className="rounded bg-slate-100 px-1">nombre,apellido,teléfono,barrio</code>. Barrios:{" "}
        {barrios.map((b) => b.nombre).join(", ")}
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={5}
        className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none ring-campana-azul-claro focus:ring-2"
        placeholder={"Ana,García,3764123456,Centro\nPedro,López,+5493764987654,Barrio Norte"}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void enviar()}
          className="rounded-xl bg-campana-azul px-4 py-2 text-sm font-semibold text-white hover:bg-campana-azul-med"
        >
          Importar filas
        </button>
        {msg ? <span className="text-sm text-slate-600">{msg}</span> : null}
      </div>
    </div>
  );
}
