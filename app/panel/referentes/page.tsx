import { prisma } from "@/lib/prisma";
import { BotonesReferente } from "./BotonesReferente";
import { crearReferente } from "./actions";

export default async function ReferentesPage() {
  const referentes = await prisma.referente.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { contactos: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Referentes barriales</h2>
        <p className="mt-1 text-sm text-slate-600">
          Aparecen en el formulario público para saber quién cargó cada contacto (premio por cargas reales).
        </p>
      </div>

      <form
        action={crearReferente}
        className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
      >
        <input
          name="nombre"
          required
          placeholder="Nombre del referente"
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        />
        <button type="submit" className="rounded-xl bg-campana-rojo px-4 py-2 text-sm font-semibold text-white">
          Agregar
        </button>
      </form>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-panel">
        {referentes.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-slate-500">Todavía no hay referentes. Agregá al menos uno.</li>
        ) : (
          referentes.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-semibold text-slate-800">{r.nombre}</p>
                <p className="text-xs text-slate-500">
                  {r._count.contactos} contacto{r._count.contactos === 1 ? "" : "s"} ·{" "}
                  {r.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
              <BotonesReferente id={r.id} activo={r.activo} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
