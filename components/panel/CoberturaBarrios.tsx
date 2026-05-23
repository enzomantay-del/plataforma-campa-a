type Fila = {
  id: string;
  nombre: string;
  _count: { contactos: number };
};

export function CoberturaBarrios({ barrios }: { barrios: Fila[] }) {
  if (barrios.length === 0) return null;

  const sinContactos = barrios.filter((b) => b._count.contactos === 0);
  const conContactos = barrios.filter((b) => b._count.contactos > 0);
  const total = barrios.reduce((s, b) => s + b._count.contactos, 0);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-panel">
      <h3 className="text-lg font-bold text-campana-azul">Cobertura por barrio</h3>
      <p className="mt-1 text-sm text-slate-600">
        {conContactos.length} de {barrios.length} barrios con al menos un contacto · {total} vecinos en total.
      </p>

      {sinContactos.length > 0 ? (
        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">Barrios sin contactos ({sinContactos.length})</p>
          <p className="mt-1 text-xs leading-relaxed">
            {sinContactos.map((b) => b.nombre).join(" · ")} — compartí el link de carga con referentes de esas zonas.
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Todos los barrios activos tienen al menos un contacto cargado.
        </p>
      )}

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {barrios.map((row) => (
          <li
            key={row.id}
            className={
              row._count.contactos === 0
                ? "flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm"
                : "flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
            }
          >
            <span className="font-medium text-campana-azul">{row.nombre}</span>
            <span className="tabular-nums font-semibold text-slate-700">{row._count.contactos}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
