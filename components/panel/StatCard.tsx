type Props = {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  acento?: "azul" | "rojo";
};

export function StatCard({ titulo, valor, subtitulo, acento = "azul" }: Props) {
  const color = acento === "rojo" ? "text-campana-rojo" : "text-campana-azul-med";
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{titulo}</p>
      <p className={`mt-2 text-3xl font-extrabold tabular-nums ${color}`}>{valor}</p>
      {subtitulo ? <p className="mt-2 text-sm text-slate-600">{subtitulo}</p> : null}
    </div>
  );
}
