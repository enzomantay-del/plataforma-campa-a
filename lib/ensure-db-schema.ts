import { prisma } from "@/lib/prisma";

/** Crea tablas si no existen (para Netlify, sin prisma migrate en build). */
export async function ensureDbSchema(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Barrio" (
      "id" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "activo" BOOLEAN NOT NULL DEFAULT true,
      CONSTRAINT "Barrio_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Referente" (
      "id" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "activo" BOOLEAN NOT NULL DEFAULT true,
      "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Referente_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Contacto" (
      "id" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "apellido" TEXT NOT NULL,
      "telefono" TEXT NOT NULL,
      "telefonoClave10" TEXT NOT NULL,
      "barrioId" TEXT NOT NULL,
      "referenteId" TEXT,
      "notas" TEXT DEFAULT '',
      "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Envio" (
      "id" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "filtroBarrio" TEXT,
      "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
      "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "descripcion" TEXT DEFAULT '',
      CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "MessageLog" (
      "id" TEXT NOT NULL,
      "envioId" TEXT NOT NULL,
      "contactoId" TEXT NOT NULL,
      "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
      "detalle" TEXT DEFAULT '',
      "waMessageId" TEXT,
      "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Sondeo" (
      "id" TEXT NOT NULL,
      "titulo" TEXT NOT NULL,
      "pregunta" TEXT NOT NULL,
      "activo" BOOLEAN NOT NULL DEFAULT false,
      "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Sondeo_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SondeoRespuesta" (
      "id" TEXT NOT NULL,
      "sondeoId" TEXT NOT NULL,
      "telefono" TEXT NOT NULL,
      "contactoId" TEXT,
      "texto" TEXT NOT NULL,
      "waMessageId" TEXT,
      "recibidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SondeoRespuesta_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Barrio_nombre_key" ON "Barrio"("nombre");`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Contacto_telefonoClave10_key" ON "Contacto"("telefonoClave10");`,
  );
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Contacto_barrioId_idx" ON "Contacto"("barrioId");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Contacto_referenteId_idx" ON "Contacto"("referenteId");`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Contacto_telefono_idx" ON "Contacto"("telefono");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PlantillaMensaje" (
      "id" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "nombreMeta" TEXT NOT NULL,
      "idioma" TEXT NOT NULL DEFAULT 'es_AR',
      "cuerpo" TEXT NOT NULL,
      "paramsPlantilla" TEXT NOT NULL DEFAULT '',
      "activa" BOOLEAN NOT NULL DEFAULT true,
      "esDefault" BOOLEAN NOT NULL DEFAULT false,
      "orden" INTEGER NOT NULL DEFAULT 0,
      "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PlantillaMensaje_pkey" PRIMARY KEY ("id")
    );
  `);
}
