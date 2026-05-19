import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Cargar contacto · Campaña",
  description: "Formulario para referentes barriales — cargá vecinos desde el celular.",
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
