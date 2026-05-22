import type { Metadata, Viewport } from "next";
import { MARCA } from "@/lib/branding";

export const metadata: Metadata = {
  title: `Cargar contacto · ${MARCA.nombre}`,
  description: `${MARCA.subtitulo} — formulario para referentes barriales.`,
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e3a5f",
};

export default function CargarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
