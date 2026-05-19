import { COOKIE_NAME, isPanelAuthRequired, isValidPanelSession } from "@/lib/panel-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (!isPanelAuthRequired()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/public/")) {
    return NextResponse.next();
  }

  if (pathname === "/api/admin/seed") {
    return NextResponse.next();
  }

  if (pathname === "/cargar" || pathname.startsWith("/cargar/")) {
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith("/panel") ||
    (pathname.startsWith("/api/") &&
      !pathname.startsWith("/api/webhooks/") &&
      !pathname.startsWith("/api/public/"));

  if (!needsAuth) {
    return NextResponse.next();
  }

  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (await isValidPanelSession(session)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Sesión requerida. Iniciá sesión en el panel." }, { status: 401 });
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/panel/:path*", "/api/:path*", "/cargar", "/cargar/:path*"],
};
