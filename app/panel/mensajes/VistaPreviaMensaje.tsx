"use client";

import { renderMensaje } from "@/lib/render-mensaje";

export function VistaPreviaMensaje({ cuerpo }: { cuerpo: string }) {
  const ejemplo = renderMensaje(cuerpo, {
    nombre: "María",
    apellido: "González",
    barrio: "Centro",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vista previa (ejemplo)</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{ejemplo || "—"}</p>
      <p className="mt-3 text-xs text-slate-500">
        Variables: <code className="rounded bg-white px-1">{"{{nombre}}"}</code>,{" "}
        <code className="rounded bg-white px-1">{"{{apellido}}"}</code>,{" "}
        <code className="rounded bg-white px-1">{"{{barrio}}"}</code>
      </p>
    </div>
  );
}
