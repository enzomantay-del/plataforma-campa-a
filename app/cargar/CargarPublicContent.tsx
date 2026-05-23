import { FormCargaPublica } from "@/app/cargar/FormCargaPublica";
import { MarcaMunicipal } from "@/components/MarcaMunicipal";
import { BARRIOS_ORDER_BY } from "@/lib/barrios-list";import { buildPublicCargaApiQuery } from "@/lib/carga-public-url";
import { ensureBarriosCargados } from "@/lib/ensure-barrios";
import { getPublicCargaKey, isPublicCargaKeyValid } from "@/lib/public-carga";
import { prisma } from "@/lib/prisma";

export async function CargarPublicContent({ claveProvista }: { claveProvista?: string | null }) {
  if (!isPublicCargaKeyValid(claveProvista ?? null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-950">
          <h1 className="text-lg font-bold">Enlace no disponible</h1>
          <p className="mt-2 text-sm">
            Pedí el link completo a la coordinación municipal (debe incluir la clave al final de la dirección).
          </p>        </div>
      </div>
    );
  }

  await ensureBarriosCargados();

  const [barrios, referentes] = await Promise.all([
    prisma.barrio.findMany({ where: { activo: true }, orderBy: BARRIOS_ORDER_BY }),
    prisma.referente.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
  ]);

  const claveEfectiva = claveProvista?.trim() || getPublicCargaKey() || "";
  const keyQuery = buildPublicCargaApiQuery(claveEfectiva || undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-6 pb-10 sm:py-8">
      <div className="mx-auto max-w-lg">
        <header className="mb-6">
          <MarcaMunicipal destacado className="mb-4" />
          <div className="rounded-xl border border-campana-azul/15 bg-campana-azul/5 px-4 py-3 text-center text-sm leading-relaxed text-slate-700">
            Estás registrando vecinos para que la municipalidad les envíe avisos sobre obras, actividades y novedades
            de su barrio por WhatsApp.
          </div>
          <h2 className="mt-4 text-center text-xl font-bold text-campana-azul sm:text-2xl">Cargar vecino / contacto</h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600 sm:text-base">
            Completá los datos desde el celular. Si el teléfono ya está en la base, te avisamos y no se duplica.
          </p>
        </header>        <FormCargaPublica barrios={barrios} referentes={referentes} keyQuery={keyQuery} />
        <p className="mt-6 text-center text-xs text-slate-500">
          Tus datos se guardan de forma segura. Solo la municipalidad ve el listado completo.
        </p>      </div>
    </div>
  );
}
