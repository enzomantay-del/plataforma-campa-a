-- CreateTable
CREATE TABLE "PlantillaMensaje" (
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
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantillaMensaje_pkey" PRIMARY KEY ("id")
);
