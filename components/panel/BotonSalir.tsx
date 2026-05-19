"use client";

import { useRouter } from "next/navigation";

export function BotonSalir({ mostrar }: { mostrar: boolean }) {
  const router = useRouter();
  if (!mostrar) return null;

  async function salir() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void salir()}
      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
    >
      Cerrar sesión
    </button>
  );
}
