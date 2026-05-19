/** URL pública del sitio (Netlify, Vercel o .env). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // Netlify (runtime y build)
  const netlify = process.env.URL?.trim() || process.env.DEPLOY_PRIME_URL?.trim();
  if (netlify) return netlify.replace(/\/$/, "");

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function isProductionHost(): boolean {
  return Boolean(
    process.env.NETLIFY === "true" ||
      process.env.URL?.includes("netlify.app") ||
      process.env.NEXT_PUBLIC_APP_URL,
  );
}
