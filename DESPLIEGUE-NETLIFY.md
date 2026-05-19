# Publicar la plataforma en Netlify (link para compartir)

Con Netlify tendés un link fijo, por ejemplo:

**`https://tu-campana.netlify.app/cargar/tu-clave`** (o `/cargar` si no usás clave)

Funciona desde cualquier celular, sin tener la PC encendida.

---

## Qué necesitás (gratis para empezar)

1. Cuenta en [GitHub](https://github.com) (para subir el código)
2. Cuenta en [Supabase](https://supabase.com) (base de datos en la nube)
3. Cuenta en [Netlify](https://www.netlify.com)
4. Tu configuración de **Meta / WhatsApp** (token, etc.)

---

## Parte 1 — Supabase (base de datos)

1. Creá un proyecto nuevo en Supabase.
2. Andá a **Project Settings → Database**.
3. Copiá dos URLs (en “Connection string” / ORM):
   - **Transaction pooler** (puerto **6543**) → `DATABASE_URL`
   - **Session / Direct** (puerto **5432**) → `DIRECT_URL`

Ejemplo en tu `.env` (no subas este archivo a GitHub):

```env
DATABASE_URL="postgresql://postgres.xxxx:TU_PASSWORD@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:TU_PASSWORD@aws-0-xxx.pooler.supabase.com:5432/postgres"
```

4. En Supabase → **SQL Editor**, no hace falta crear tablas a mano: Netlify ejecutará las migraciones en el primer deploy.

---

## Parte 2 — Subir el código a GitHub

1. Creá un repositorio vacío en GitHub (ej. `plataforma-campana`).
2. En la carpeta `campana-mvp`, subí **solo el contenido de esa carpeta** (no hace falta `node_modules` ni `.env`).

Si usás Git en la PC:

```bash
cd "D:\Documents\Prueba de Cursor\campana-mvp"
git init
git add .
git commit -m "Plataforma campaña MVP"
git remote add origin https://github.com/TU_USUARIO/plataforma-campana.git
git push -u origin main
```

---

## Parte 3 — Conectar Netlify

1. En [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Elegí **GitHub** y el repositorio.
3. Si el repo tiene más carpetas, configurá:
   - **Base directory:** `campana-mvp` (si el repo es la carpeta padre)
   - **Build command:** (ya viene de `netlify.toml`) `npm run build:netlify`
   - **Publish:** lo maneja el plugin de Next.js automáticamente.

4. Antes de deployar, en **Site configuration → Environment variables**, cargá:

| Variable | Valor |
|----------|--------|
| `DATABASE_URL` | Pooler Supabase (6543) |
| `DIRECT_URL` | Conexión directa Supabase (5432) |
| `WHATSAPP_ACCESS_TOKEN` | Token Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | ID número |
| `WHATSAPP_VERIFY_TOKEN` | Frase que inventás |
| `WHATSAPP_APP_SECRET` | App Secret Meta (recomendado) |
| `NEXT_PUBLIC_APP_URL` | `https://TU-SITIO.netlify.app` (sin barra final) |
| `PUBLIC_CARGA_KEY` | Frase secreta para `/cargar?k=...` (opcional) |
| `PANEL_PASSWORD` | Contraseña del panel (recomendado) |
| `SEED_SECRET` | Frase larga para cargar barrios la primera vez (ver abajo) |

5. **Deploy site**.

El primer build puede tardar varios minutos.

---

## Parte 4 — Cargar barrios y referentes (primera vez)

Después del deploy exitoso:

### Opción A — Desde tu PC (recomendado)

1. En el `.env` local poné las **mismas** `DATABASE_URL` y `DIRECT_URL` de Supabase.
2. En la carpeta `campana-mvp`:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

Eso carga los barrios de Jardín América y datos de ejemplo.

### Opción B — Sin terminal (una sola vez)

1. En Netlify agregá variable `SEED_SECRET=una-frase-muy-larga-secreta`.
2. Abrí en el navegador (reemplazá URL y secreto):

```text
https://TU-SITIO.netlify.app/api/admin/seed
```

Usá una herramienta como Postman, o en PowerShell:

```powershell
Invoke-WebRequest -Uri "https://TU-SITIO.netlify.app/api/admin/seed" -Method POST -Headers @{ "x-seed-secret" = "TU_SEED_SECRET" }
```

3. Borrá o cambiá `SEED_SECRET` después si querés.

Luego en el panel: **Referentes** → agregá los nombres reales.

---

## Parte 5 — Link para referentes

1. Entrá al panel: `https://TU-SITIO.netlify.app/panel`
2. **Carga pública** → **Copiar enlace para referentes**
3. Será algo como: `https://TU-SITIO.netlify.app/cargar/tu-clave`

Compartilo por WhatsApp. Ya no uses `localhost`.

---

## Parte 6 — Webhook de WhatsApp (Meta)

En Meta Developers → Webhook:

```text
https://TU-SITIO.netlify.app/api/webhooks/whatsapp
```

Verify token = el mismo que `WHATSAPP_VERIFY_TOKEN`.

---

## Desarrollo local (después de Supabase)

Ya no usamos SQLite en producción. En tu PC:

1. Poné `DATABASE_URL` y `DIRECT_URL` de Supabase en `.env`.
2. `iniciar-panel.bat` o `npm run dev`.

Así local y Netlify comparten la misma base (cuidado: lo que borrés en local afecta producción).

Para base **solo local** sin tocar producción, creá otro proyecto Supabase de prueba.

---

## Problemas frecuentes

| Problema | Solución |
|----------|----------|
| Build falla en Prisma | Revisá `DATABASE_URL` y `DIRECT_URL` en Netlify |
| `/cargar` 403 | Falta `?k=` o `PUBLIC_CARGA_KEY` no coincide |
| Panel pide login | `PANEL_PASSWORD` en Netlify |
| WhatsApp sin entregado/leído | Webhook apuntando a Netlify + `WHATSAPP_APP_SECRET` |
| No hay barrios en el formulario | Ejecutá seed (Parte 4) |

---

## Resumen

- **Netlify** = sitio público 24/7  
- **Supabase** = donde viven los contactos  
- **Link a compartir** = `https://tu-sitio.netlify.app/cargar/tu-clave`  

Si necesitás ayuda con un paso, anotá en qué número te trabaste y el mensaje de error exacto.
