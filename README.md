# Plataforma de campaña — MVP

Next.js + Prisma + PostgreSQL (Supabase): contactos por barrio, **formulario público** para referentes, envíos WhatsApp (Meta), métricas y sondeos. Deploy: **Netlify** — ver `DESPLIEGUE-NETLIFY.md`.

## Para empezar (sin programar)

1. [Node.js LTS](https://nodejs.org)
2. Doble clic en **`iniciar-panel.bat`**
3. **`configurar-whatsapp.bat`** para Meta
4. **`COMO-EMPEZAR.txt`** — guía completa

## Formulario público (referentes)

1. Panel → **Referentes** → agregá quiénes cargan vecinos
2. Panel → **Carga pública** → **Copiar enlace** → compartir por WhatsApp
3. URL: `http://localhost:3000/cargar` (en producción, tu dominio)

Opcional en `.env`: `PUBLIC_CARGA_KEY=frase-secreta` → el link será `/cargar?k=frase-secreta`

- Un solo link para todos
- Barrio obligatorio (lista de Jardín América en `lib/barrios-default.ts`)
- Nombre, apellido y teléfono obligatorios
- Duplicados bloqueados (últimos 10 dígitos del teléfono)
- Ranking de referentes en **Carga pública**

## Métricas WhatsApp

Panel → **Métricas**: enviados, **recibidos** (entregado al celular), **leídos** (tilde azul). Requiere **webhook** en Meta apuntando a tu servidor.

## Menú del panel

| Sección | Función |
|--------|---------|
| Carga pública | Link + ranking referentes |
| Referentes | Alta de quienes cargan |
| Contactos | Base completa |
| Envíos | WhatsApp + simulación |
| Métricas | Recibidos / leídos |
| Sondeos | Respuestas entrantes |
| Configuración | Meta / token |

## Variables `.env`

- `PANEL_PASSWORD` — login del panel
- `PUBLIC_CARGA_KEY` — proteger formulario público
- `WHATSAPP_*` — Cloud API
- `NEXT_PUBLIC_APP_URL` — URL pública (ngrok o dominio)

## Scripts

| Comando | Uso |
|--------|-----|
| `npm run dev` | Desarrollo |
| `npm run db:seed` | Barrios + datos demo |
| `npm run db:migrate` | Migraciones |

## Publicar en Netlify

Guía completa: **`DESPLIEGUE-NETLIFY.md`** → link `https://tu-sitio.netlify.app/cargar` para compartir por WhatsApp.

## Base de datos

- **Producción / Netlify:** Supabase (`DATABASE_URL` + `DIRECT_URL`)
- El antiguo SQLite local (`dev.db`) ya no se usa; migrá a Supabase también para desarrollo en PC si querés los mismos datos.
