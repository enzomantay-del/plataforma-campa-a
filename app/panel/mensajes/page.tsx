import { ensureDbSchema } from "@/lib/ensure-db-schema";
import { prisma } from "@/lib/prisma";
import { FormCrearPlantilla } from "./FormCrearPlantilla";
import { ListaPlantillas } from "./ListaPlantillas";

export default async function MensajesPage() {
  let plantillas: Awaited<ReturnType<typeof prisma.plantillaMensaje.findMany>> = [];
  try {
    plantillas = await prisma.plantillaMensaje.findMany({
      orderBy: [{ esDefault: "desc" }, { orden: "asc" }, { nombre: "asc" }],
    });
  } catch {
    try {
      await ensureDbSchema();
      plantillas = await prisma.plantillaMensaje.findMany({
        orderBy: [{ esDefault: "desc" }, { orden: "asc" }, { nombre: "asc" }],
      });
    } catch {
      plantillas = [];
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Mensajes WhatsApp</h2>
        <p className="mt-1 text-sm text-slate-600">
          Diseñá el texto y las variables. Luego elegís la plantilla al enviar desde{" "}
          <strong>Envíos</strong>. El nombre Meta debe coincidir con una plantilla aprobada en Meta.
        </p>
      </div>

      <FormCrearPlantilla />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-campana-azul">Plantillas guardadas</h3>
        </div>
        <ListaPlantillas plantillas={plantillas} />
      </div>
    </div>
  );
}
