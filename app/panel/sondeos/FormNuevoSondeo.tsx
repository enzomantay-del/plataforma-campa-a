import { crearSondeo } from "./actions";

export function FormNuevoSondeo() {
  return (
    <form action={crearSondeo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <h3 className="font-semibold text-campana-azul">Nuevo sondeo</h3>
      <p className="mt-1 text-sm text-slate-600">
        Cuando un sondeo está <strong>activo</strong>, cada mensaje de texto que llegue por WhatsApp se guarda
        como respuesta (con el webhook configurado en Meta).
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Título interno</span>
          <input
            name="titulo"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
            placeholder="Ej. Intención de voto — Centro"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-600">Pregunta (referencia para el equipo)</span>
          <textarea
            name="pregunta"
            required
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
            placeholder="¿Vas a acompañarnos el domingo?"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-4 rounded-xl bg-campana-rojo px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
      >
        Crear sondeo
      </button>
    </form>
  );
}
