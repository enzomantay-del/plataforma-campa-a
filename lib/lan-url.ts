import os from "os";
import { buildPublicCargaPath, buildPublicCargaUrl, isShareablePublicUrl } from "@/lib/carga-public-url";

/** IPv4 de la red local (ej. 192.168.0.15) para compartir con celulares en la misma Wi‑Fi. */
export function getLanIpv4(): string | null {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const ifaces = nets[name];
    if (!ifaces) continue;
    for (const net of ifaces) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

export function buildCargaPublicUrl(params: {
  lanIp?: string | null;
  port?: number;
  clave?: string;
  /** URL pública (Netlify, ngrok, dominio propio). Si existe, es el enlace a compartir. */
  siteUrl?: string | null;
}): {
  compartir: string;
  soloEnPc: string;
  aviso: string;
  esPublicoInternet: boolean;
} {
  const port = params.port ?? 3000;
  const path = buildPublicCargaPath(params.clave);
  const soloEnPc = `http://localhost:${port}${path}`;

  const publicBase = params.siteUrl?.replace(/\/$/, "");
  if (publicBase && isShareablePublicUrl(`${publicBase}${path}`)) {
    const compartir = buildPublicCargaUrl(publicBase, params.clave);
    return {
      compartir,
      soloEnPc,
      esPublicoInternet: true,
      aviso:
        "Este enlace funciona desde cualquier celular (4G o Wi‑Fi). Compartilo por WhatsApp con los referentes.",
    };
  }

  if (params.lanIp) {
    const compartir = `http://${params.lanIp}:${port}${path}`;
    return {
      compartir,
      soloEnPc,
      esPublicoInternet: false,
      aviso:
        "Solo para prueba en la misma Wi‑Fi: el celular debe estar en la misma red que esta PC y el panel encendido. Para referentes en la calle, publicá en Netlify (ver desplegar-para-compartir.bat).",
    };
  }

  return {
    compartir: soloEnPc,
    soloEnPc,
    esPublicoInternet: false,
    aviso:
      "Este enlace NO abre en otros celulares. Publicá el sitio en Netlify o usá link-publico-ngrok.bat para obtener una dirección https real.",
  };
}
