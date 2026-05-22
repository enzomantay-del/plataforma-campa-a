/** Reemplaza variables en textos de mensaje / plantilla. */
export function renderMensaje(
  texto: string,
  datos: { nombre?: string; apellido?: string; barrio?: string },
): string {
  return texto
    .replace(/\{\{nombre\}\}/gi, datos.nombre ?? "")
    .replace(/\{\{apellido\}\}/gi, datos.apellido ?? "")
    .replace(/\{\{barrio\}\}/gi, datos.barrio ?? "");
}

export function paramsDesdePlantilla(paramsPlantilla: string): string[] {
  if (!paramsPlantilla.trim()) return [];
  return paramsPlantilla
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
