"use client";

import { MarcaMunicipal } from "@/components/MarcaMunicipal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/panel";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo ingresar.");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <form
        onSubmit={(e) => void ingresar(e)}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-panel"
      >
        <MarcaMunicipal className="mb-6" />
        <h2 className="text-xl font-bold text-campana-azul">Ingresá al panel</h2>
        <p className="mt-2 text-sm text-slate-600">
          La contraseña está en el archivo <code className="rounded bg-slate-100 px-1">.env</code> como{" "}
          <code className="rounded bg-slate-100 px-1">PANEL_PASSWORD</code>. Si no la configuraste, el panel
          queda abierto en tu PC.
        </p>
        <label className="mt-6 block text-sm">
          <span className="text-slate-600">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-campana-azul-claro focus:ring-2"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded-xl bg-campana-azul py-2.5 text-sm font-semibold text-white hover:bg-campana-azul-med disabled:opacity-50"
        >
          {cargando ? "Ingresando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">Cargando…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
