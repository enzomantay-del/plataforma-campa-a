import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MARCA } from "@/lib/branding";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${MARCA.nombre} · ${MARCA.municipio}`,
  description: `${MARCA.subtitulo}. ${MARCA.descripcion}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased font-sans min-h-screen`}>{children}</body>
    </html>
  );
}
