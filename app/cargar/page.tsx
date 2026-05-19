import { CargarPublicContent } from "@/app/cargar/CargarPublicContent";
import { buildPublicCargaPath } from "@/lib/carga-public-url";
import { isPublicCargaKeyValid } from "@/lib/public-carga";
import { redirect } from "next/navigation";

export default async function CargarPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;

  if (k?.trim() && isPublicCargaKeyValid(k)) {
    redirect(buildPublicCargaPath(k.trim()));
  }

  return <CargarPublicContent claveProvista={k ?? null} />;
}
