/**
 * Variables de entorno Cloud API (Meta).
 * Token: WHATSAPP_ACCESS_TOKEN o WHATSAPP_TOKEN
 * Phone ID: WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_PHONE_ID
 */

export function getWhatsAppAccessToken(): string | undefined {
  const t = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
  return t?.trim() || undefined;
}

export function getWhatsAppPhoneNumberId(): string | undefined {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
  return id?.trim() || undefined;
}

export function getWhatsAppVerifyToken(): string | undefined {
  return process.env.WHATSAPP_VERIFY_TOKEN?.trim() || undefined;
}

export function getWhatsAppAppSecret(): string | undefined {
  return process.env.WHATSAPP_APP_SECRET?.trim() || undefined;
}

export function getWhatsAppApiVersion(): string {
  return process.env.WHATSAPP_API_VERSION?.trim() || "v21.0";
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(getWhatsAppAccessToken() && getWhatsAppPhoneNumberId());
}

export function getDefaultTemplateName(): string {
  return process.env.WHATSAPP_DEFAULT_TEMPLATE?.trim() || "hello_world";
}

export function getDefaultTemplateLanguage(): string {
  return process.env.WHATSAPP_DEFAULT_TEMPLATE_LANG?.trim() || "en_US";
}
