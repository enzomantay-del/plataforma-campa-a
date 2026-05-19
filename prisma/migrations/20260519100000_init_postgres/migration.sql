-- CreateTable
CREATE TABLE "Barrio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Barrio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "telefonoClave10" TEXT NOT NULL,
    "barrioId" TEXT NOT NULL,
    "referenteId" TEXT,
    "notas" TEXT DEFAULT '',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Envio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "filtroBarrio" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT DEFAULT '',

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageLog" (
    "id" TEXT NOT NULL,
    "envioId" TEXT NOT NULL,
    "contactoId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "detalle" TEXT DEFAULT '',
    "waMessageId" TEXT,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sondeo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sondeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SondeoRespuesta" (
    "id" TEXT NOT NULL,
    "sondeoId" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contactoId" TEXT,
    "texto" TEXT NOT NULL,
    "waMessageId" TEXT,
    "recibidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SondeoRespuesta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barrio_nombre_key" ON "Barrio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Contacto_telefonoClave10_key" ON "Contacto"("telefonoClave10");

-- CreateIndex
CREATE INDEX "Contacto_barrioId_idx" ON "Contacto"("barrioId");

-- CreateIndex
CREATE INDEX "Contacto_referenteId_idx" ON "Contacto"("referenteId");

-- CreateIndex
CREATE INDEX "Contacto_telefono_idx" ON "Contacto"("telefono");

-- CreateIndex
CREATE INDEX "MessageLog_envioId_idx" ON "MessageLog"("envioId");

-- CreateIndex
CREATE INDEX "MessageLog_contactoId_idx" ON "MessageLog"("contactoId");

-- CreateIndex
CREATE INDEX "MessageLog_waMessageId_idx" ON "MessageLog"("waMessageId");

-- CreateIndex
CREATE INDEX "MessageLog_estado_idx" ON "MessageLog"("estado");

-- CreateIndex
CREATE INDEX "SondeoRespuesta_sondeoId_idx" ON "SondeoRespuesta"("sondeoId");

-- CreateIndex
CREATE INDEX "SondeoRespuesta_telefono_idx" ON "SondeoRespuesta"("telefono");

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_barrioId_fkey" FOREIGN KEY ("barrioId") REFERENCES "Barrio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_referenteId_fkey" FOREIGN KEY ("referenteId") REFERENCES "Referente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_envioId_fkey" FOREIGN KEY ("envioId") REFERENCES "Envio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Contacto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SondeoRespuesta" ADD CONSTRAINT "SondeoRespuesta_sondeoId_fkey" FOREIGN KEY ("sondeoId") REFERENCES "Sondeo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
