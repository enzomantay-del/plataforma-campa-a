/** Clave opcional para el formulario público (?k= o PUBLIC_CARGA_KEY en .env). */
export function getPublicCargaKey(): string | undefined {
  return process.env.PUBLIC_CARGA_KEY?.trim() || undefined;
}

export function isPublicCargaKeyValid(provided: string | null | undefined): boolean {
  const expected = getPublicCargaKey();
  if (!expected) return true;
  const p = provided?.trim() ?? "";
  return p.length > 0 && p === expected;
}
