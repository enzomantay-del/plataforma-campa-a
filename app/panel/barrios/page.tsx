import { LinkMapaBarrios } from "@/components/LinkMapaBarrios";
import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";
import { prisma } from "@/lib/prisma";
import { BotonesBarrio } from "./BotonesBarrio";
import { crearBarrio } from "./actions";

export default async function BarriosPage() {
  const barrios = await prisma.barrio.findMany({
    orderBy: BARRIOS_ORDER_BY,
    include: { _count: { select: { contactos: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Barrios</h2>
        <p className="mt-1 text-sm text-slate-600">
          Lista territorial para contactos y formulario público. Los inactivos no aparecen al cargar datos. Las listas
          se ordenan alfabéticamente.
        </p>
        <LinkMapaBarrios className="mt-2 text-sm text-slate-600" compacto />
      </div>

      <form
        action={crearBarrio}
        className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel"
      >
        <input
          name="nombre"
          required
          placeholder="Nombre del barrio"
          className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-campana-azul-claro focus:ring-2"
        />
        <button type="submit" className="rounded-xl bg-campana-rojo px-4 py-2 text-sm font-semibold text-white">
          Agregar barrio
        </button>
      </form>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-panel">
        {barrios.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-slate-500">No hay barrios. Agregá al menos uno.</li>
        ) : (
          barrios.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-semibold text-slate-800">{b.nombre}</p>
                <p className="text-xs text-slate-500">
                  {b._count.contactos} contacto{b._count.contactos === 1 ? "" : "s"} · Orden {b.orden + 1} ·{" "}
                  {b.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
              <BotonesBarrio id={b.id} activo={b.activo} nombre={b.nombre} contactos={b._count.contactos} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
