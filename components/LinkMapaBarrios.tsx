import { BARRIOS_MAPA_URL } from "@/lib/barrios-list";

type Props = {
  className?: string;
  /** Texto más corto para espacios chicos (ej. panel). */
  compacto?: boolean;
};

export function LinkMapaBarrios({ className = "mt-1.5 text-xs text-slate-600", compacto = false }: Props) {
  return (
    <p className={className}>
      {compacto ? (
        <>
          ¿No sabés el barrio?{" "}
          <a
            href={BARRIOS_MAPA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-campana-azul underline hover:text-campana-azul-med"
          >
            Ver mapa
          </a>
        </>
      ) : (
        <>
          Si no sabés a qué barrio pertenece el contacto,{" "}
          <a
            href={BARRIOS_MAPA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-campana-azul underline hover:text-campana-azul-med"
          >
            consultá el mapa de barrios de Jardín América
          </a>
          .
        </>
      )}
    </p>
  );
}
