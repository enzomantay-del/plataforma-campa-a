import { Sidebar } from "@/components/panel/Sidebar";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Sidebar />
      {/* min-w-0 evita que la columna empuje el grid y “coma” el ancho del contenido */}
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-12 xl:px-14">{children}</main>
    </div>
  );
}
