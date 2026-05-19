import { getSiteUrl } from "@/lib/site-url";
import {
  getWhatsAppVerifyToken,
  isWhatsAppConfigured,
} from "@/lib/whatsapp-config";
import { ConfigEstado } from "./ConfigEstado";

export default function ConfigPage() {
  const urlBase = getSiteUrl();

  const urlWebhook = `${urlBase}/api/webhooks/whatsapp`;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-campana-azul">Configuración</h2>
      <p className="text-sm text-slate-600">
        Acá conectás WhatsApp (Meta) y revisás que todo esté listo. No hace falta programar: seguí los pasos y
        usá el botón de prueba.
      </p>

      <ConfigEstado
        inicial={{
          configurado: isWhatsAppConfigured(),
          verifyToken: Boolean(getWhatsAppVerifyToken()),
          urlWebhook,
        }}
      />

      <div className="rounded-2xl border border-campana-azul/15 bg-campana-azul/5 p-6">
        <h3 className="font-semibold text-campana-azul">Paso a paso (sin tecnicismos)</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
          <li>
            En la carpeta del proyecto, hacé doble clic en <strong>configurar-whatsapp.bat</strong> (abre el
            archivo de configuración).
          </li>
          <li>
            Pegá el token que copiaste de Meta en{" "}
            <code className="rounded bg-white px-1">WHATSAPP_ACCESS_TOKEN=</code> —{" "}
            <strong>todo en una sola línea</strong>, sin saltos de línea.
          </li>
          <li>
            Pegá el ID del número en{" "}
            <code className="rounded bg-white px-1">WHATSAPP_PHONE_NUMBER_ID=</code> (en Meta: Configuración de
            la API).
          </li>
          <li>
            Inventá una frase secreta en{" "}
            <code className="rounded bg-white px-1">WHATSAPP_VERIFY_TOKEN=</code> (ej.{" "}
            <em>mi-campana-2026</em>).
          </li>
          <li>
            Opcional: <code className="rounded bg-white px-1">PANEL_PASSWORD=</code> para que nadie entre al panel
            sin contraseña.
          </li>
          <li>Guardá el archivo, cerrá Bloc de notas y ejecutá de nuevo <strong>iniciar-panel.bat</strong>.</li>
          <li>Volvé acá y tocá <strong>Probar conexión con Meta</strong>.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h3 className="font-semibold text-campana-azul">Webhook (entregado / leído)</h3>
        <p className="mt-2 text-sm text-slate-600">
          Para que el panel actualice cuando alguien recibe o lee el mensaje, en Meta cargá esta URL (en
          producción o con ngrok en tu PC):
        </p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm text-emerald-300">
          {urlWebhook}
        </pre>
        <p className="mt-3 text-sm text-slate-600">
          El <strong>Verify token</strong> en Meta debe ser exactamente el mismo que pusiste en{" "}
          <code className="rounded bg-slate-100 px-1">WHATSAPP_VERIFY_TOKEN</code>.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-semibold">Primera prueba de envío</p>
        <p className="mt-2 leading-relaxed">
          En <strong>Envíos</strong>, usá plantilla <code className="rounded bg-amber-100/80 px-1">hello_world</code>{" "}
          e idioma <code className="rounded bg-amber-100/80 px-1">en_US</code>. Solo podés escribir a números que
          agregaste como <strong>destinatarios de prueba</strong> en Meta.
        </p>
      </div>
    </div>
  );
}
