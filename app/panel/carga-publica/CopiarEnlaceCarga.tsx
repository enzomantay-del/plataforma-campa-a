"use client";

import { useState } from "react";

type Props = {
  clave?: string;
  urlCompartir: string;
  urlSoloPc: string;
  avisoRed: string;
  esPublicoInternet: boolean;
};

export function CopiarEnlaceCarga({
  clave,
  urlCompartir,
  urlSoloPc,
  avisoRed,
  esPublicoInternet,
}: Props) {
  const [copiado, setCopiado] = useState<"compartir" | "pc" | null>(null);

  async function copiar(url: string, tipo: "compartir" | "pc") {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(tipo);
      setTimeout(() => setCopiado(null), 2500);
    } catch {
      window.prompt("Copiá este enlace:", url);
    }
  }

  const esMismo = urlCompartir === urlSoloPc;
  const textoWhatsApp = encodeURIComponent(
    `Hola! Cargá los contactos de tu barrio acá (solo nombre, apellido y teléfono):\n${urlCompartir}`,
  );
  const enlaceWa = `https://wa.me/?text=${textoWhatsApp}`;

  return (
    <div className="space-y-4">
      <div
        className={
          esPublicoInternet
            ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"
            : "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-950"
        }
      >
        <p className="font-semibold">{esPublicoInternet ? "Listo para compartir" : "Falta publicar en internet"}</p>
        <p className="mt-1 leading-relaxed">{avisoRed}</p>
        {!esPublicoInternet ? (
          <p className="mt-3 text-xs leading-relaxed">
            <strong>localhost</strong> y <strong>192.168…</strong> no sirven por WhatsApp a otra persona. Ejecutá{" "}
            <strong>desplegar-para-compartir.bat</strong> (Netlify, recomendado) o <strong>link-publico-ngrok.bat</strong>{" "}
            (prueba rápida).
          </p>
        ) : null}
      </div>

      <div
        className={
          esPublicoInternet
            ? "rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6"
            : "rounded-2xl border border-slate-200 bg-white p-6 shadow-panel"
        }
      >
        <h3 className="font-semibold text-campana-azul">
          {esPublicoInternet ? "Enlace para referentes (cualquier celular)" : "Vista previa del enlace (aún no público)"}
        </h3>
        <p className="mt-4 break-all rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800">{urlCompartir}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => void copiar(urlCompartir, "compartir")}
            className="rounded-xl bg-campana-azul px-5 py-3 text-sm font-semibold text-white hover:bg-campana-azul-med"
          >
            {copiado === "compartir" ? "¡Copiado!" : "Copiar enlace"}
          </button>
          {esPublicoInternet ? (
            <a
              href={enlaceWa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-600 bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Enviar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      {!esMismo ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
          <p className="font-medium text-slate-700">Probar en esta computadora</p>
          <p className="mt-2 break-all font-mono text-xs text-slate-600">{urlSoloPc}</p>
          <button
            type="button"
            onClick={() => void copiar(urlSoloPc, "pc")}
            className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            {copiado === "pc" ? "Copiado" : "Copiar localhost"}
          </button>
        </div>
      ) : null}

      {!clave ? (
        <p className="text-xs text-slate-500">
          Opcional: <code className="rounded bg-slate-100 px-1">PUBLIC_CARGA_KEY=...</code> en .env / Netlify para que
          solo quien tenga el enlace pueda cargar.
        </p>
      ) : null}

      {esPublicoInternet ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
          <h3 className="font-semibold text-campana-azul">Código QR para referentes</h3>
          <p className="mt-1 text-sm text-slate-600">
            Imprimí o compartí esta imagen. Al escanearla se abre el formulario de carga en el celular.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(urlCompartir)}`}
              alt="QR del formulario de carga"
              width={240}
              height={240}
              className="rounded-xl border border-slate-200 bg-white p-2"
            />
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              Tip: guardá la imagen (clic derecho → guardar) y mandala por WhatsApp a los referentes de cada barrio.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
