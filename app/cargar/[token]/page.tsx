import { CargarPublicContent } from "@/app/cargar/CargarPublicContent";

export default async function CargarConTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const clave = decodeURIComponent(token);
  return <CargarPublicContent claveProvista={clave} />;
}
