import { MARCA, MARCA_PANEL } from "@/lib/branding";
import Image from "next/image";

type Props = {
  /** Sidebar del panel — logo chico + textos apilados. */
  compacto?: boolean;
  /** Formulario público / login — logo grande centrado. */
  destacado?: boolean;
  className?: string;
};

export function MarcaMunicipal({ compacto = false, destacado = false, className = "" }: Props) {
  if (compacto) {
    return (
      <div className={className}>
        <div className="overflow-hidden rounded-xl bg-black">
          <Image
            src={MARCA.logoSrc}
            alt={MARCA.logoAlt}
            width={224}
            height={72}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-campana-rojo">{MARCA.nombre}</p>
        <p className="mt-0.5 text-sm font-bold leading-tight text-campana-azul">{MARCA_PANEL.titulo}</p>
        <p className="mt-1 text-xs text-slate-500">{MARCA.subtitulo}</p>
      </div>
    );
  }

  const logoWidth = destacado ? 320 : 280;
  const logoHeight = destacado ? 96 : 84;

  return (
    <div className={`text-center ${className}`}>
      <div className="mx-auto inline-block overflow-hidden rounded-2xl bg-black shadow-panel">
        <Image
          src={MARCA.logoSrc}
          alt={MARCA.logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="h-auto w-full max-w-[min(100%,20rem)] object-contain sm:max-w-xs"
          priority={destacado}
        />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-campana-rojo">{MARCA.nombre}</p>
      <h1 className="mt-1 text-xl font-bold text-campana-azul sm:text-2xl">{MARCA.subtitulo}</h1>
      {destacado ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{MARCA.descripcion}</p>
      ) : null}
    </div>
  );
}
