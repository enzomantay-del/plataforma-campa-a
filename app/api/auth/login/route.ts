import { COOKIE_NAME, createPanelSessionToken, getPanelPassword } from "@/lib/panel-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const pwd = getPanelPassword();
  if (!pwd) {
    return NextResponse.json({ ok: true, sinPassword: true });
  }

  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  const ingresada = String(body.password ?? "");
  if (ingresada !== pwd) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await createPanelSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
