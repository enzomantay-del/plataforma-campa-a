const DEFAULT_ORIGINS = [
  "http://localhost:3456",
  "http://127.0.0.1:3456",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

function getAllowedOrigins(): string[] {
  const fromEnv =
    process.env.PORTAL_MUNICIPAL_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

/** Cabeceras CORS para endpoints públicos consumidos desde el portal municipal. */
export function publicCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  const allowed = getAllowedOrigins();
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }

  return headers;
}

export function withPublicCors<T extends Response>(request: Request, response: T): T {
  const cors = publicCorsHeaders(request);
  for (const [key, value] of Object.entries(cors)) {
    response.headers.set(key, value);
  }
  return response;
}

export function publicOptionsResponse(request: Request): Response {
  return new Response(null, { status: 204, headers: publicCorsHeaders(request) });
}
