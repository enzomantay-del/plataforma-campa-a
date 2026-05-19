/** Ruta del formulario público (con clave en el path, más fácil de compartir por WhatsApp). */
export function buildPublicCargaPath(clave?: string): string {
  const c = clave?.trim();
  if (c) return `/cargar/${encodeURIComponent(c)}`;
  return "/cargar";
}

/** Query para POST /api/public/contactos */
export function buildPublicCargaApiQuery(clave?: string): string {
  const c = clave?.trim();
  if (c) return `?k=${encodeURIComponent(c)}`;
  return "";
}

export function buildPublicCargaUrl(siteUrl: string, clave?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${buildPublicCargaPath(clave)}`;
}

/** true si el enlace sirve fuera de la PC (Netlify, ngrok, dominio propio). */
export function isShareablePublicUrl(url: string): boolean {
  const u = url.toLowerCase();
  if (u.includes("localhost") || u.includes("127.0.0.1")) return false;
  if (/^http:\/\/192\.168\./.test(u) || /^http:\/\/10\./.test(u)) return false;
  return u.startsWith("https://") || u.startsWith("http://");
}
