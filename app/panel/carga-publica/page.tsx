import { CopiarEnlaceCarga } from "@/app/panel/carga-publica/CopiarEnlaceCarga";
import { ensureBarriosCargados } from "@/lib/ensure-barrios";
import { buildCargaPublicUrl, getLanIpv4 } from "@/lib/lan-url";
import { getSiteUrl, isProductionHost } from "@/lib/site-url";
import { getPublicCargaKey } from "@/lib/public-carga";
import { rankingReferentes } from "@/lib/metricas";
import { prisma } from "@/lib/prisma";

export default async function CargaPublicaPage() {
  await ensureBarriosCargados();
  const ranking = await rankingReferentes();
  const totalContactos = await prisma.contacto.count();
  const clave = getPublicCargaKey();
  const urls = buildCargaPublicUrl({
    lanIp: isProductionHost() ? null : getLanIpv4(),
    clave: clave ?? undefined,
    siteUrl: getSiteUrl(),
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-campana-azul">Carga pública de contactos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Un solo enlace para todos los referentes. Duplicados se detectan por teléfono (últimos 10 dígitos).
        </p>
      </div>

      <CopiarEnlaceCarga
        clave={clave}
        urlCompartir={urls.compartir}
        urlSoloPc={urls.soloEnPc}
        avisoRed={urls.aviso}
        esPublicoInternet={urls.esPublicoInternet}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h3 className="font-semibold text-campana-azul">Ranking de referentes</h3>
        <p className="mt-1 text-xs text-slate-500">
          {totalContactos} contactos en base · columna «entregados» = tuvieron al menos un WhatsApp recibido (con
          webhook activo).
        </p>
        {ranking.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Sin datos todavía.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 font-semibold">Referente</th>
                <th className="py-2 font-semibold text-right">Cargados</th>
                <th className="py-2 font-semibold text-right">Con entrega WA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranking.map((r) => (
                <tr key={r.referenteId ?? r.nombre}>
                  <td className="py-2 font-medium text-slate-800">{r.nombre}</td>
                  <td className="py-2 text-right tabular-nums">{r.cargados}</td>
                  <td className="py-2 text-right tabular-nums text-emerald-700">{r.entregados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="rounded-2xl border border-campana-azul/15 bg-campana-azul/5 p-5 text-sm text-slate-700">
        <p className="font-semibold text-campana-azul">Antes de compartir</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Cargá referentes en <strong>Referentes</strong> (aparecen en el formulario).
          </li>
          <li>
            Publicá en internet con <strong>desplegar-para-compartir.bat</strong> (Netlify). Sin eso, el link no abre en
            otros celulares.
          </li>
          <li>
            Después del deploy, el enlace será{" "}
            <code className="rounded bg-white px-1">https://tu-sitio.netlify.app/cargar/…</code>
          </li>
        </ol>
      </div>
    </div>
  );
}
