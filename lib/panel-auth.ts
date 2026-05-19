const COOKIE_NAME = "campana_panel";
const SALT = "campana-mvp-panel-v1";

export function getPanelPassword(): string | undefined {
  const p = process.env.PANEL_PASSWORD?.trim();
  return p || undefined;
}

/** Si no hay PANEL_PASSWORD, el panel queda abierto (solo desarrollo local). */
export function isPanelAuthRequired(): boolean {
  return Boolean(getPanelPassword());
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Hash de sesión compatible con Edge (middleware) y Node (API login). */
export async function createPanelSessionToken(): Promise<string> {
  const pwd = getPanelPassword();
  if (!pwd) return "";
  return sha256Hex(`${SALT}:${pwd}`);
}

export async function isValidPanelSession(cookieValue: string | undefined): Promise<boolean> {
  if (!isPanelAuthRequired()) return true;
  if (!cookieValue) return false;
  const expected = await createPanelSessionToken();
  return timingSafeEqualString(cookieValue, expected);
}

export { COOKIE_NAME };
