import { PrismaClient } from "@prisma/client";
import { BARRIOS_JARDIN_AMERICA } from "../lib/barrios-default";
import { normalizarTelefono, telefonoClave10 } from "../lib/phone";

const prisma = new PrismaClient();

async function upsertBarrios() {
  for (let i = 0; i < BARRIOS_JARDIN_AMERICA.length; i++) {
    const nombre = BARRIOS_JARDIN_AMERICA[i];
    await prisma.barrio.upsert({
      where: { nombre },
      create: { nombre, orden: i },
      update: { orden: i, activo: true },
    });
  }
}

async function main() {
  await upsertBarrios();

  const centro = await prisma.barrio.findUniqueOrThrow({ where: { nombre: "Centro" } });
  const norte = await prisma.barrio.findFirst({ where: { nombre: "Barrio Norte" } });
  const sur = await prisma.barrio.findFirst({ where: { nombre: "Barrio Sur" } });
  const oeste = await prisma.barrio.findFirst({ where: { nombre: "Barrio Oeste" } });

  let refDemo = await prisma.referente.findFirst({ where: { nombre: "Referente demo" } });
  if (!refDemo) {
    refDemo = await prisma.referente.create({ data: { nombre: "Referente demo" } });
  }

  await prisma.messageLog.deleteMany();
  await prisma.envio.deleteMany();
  await prisma.contacto.deleteMany();

  const demo = [
    { nombre: "María", apellido: "González", telefono: "1123456789", barrioId: centro.id, notas: "Ejemplo" },
    {
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "+5492235512345",
      barrioId: norte?.id ?? centro.id,
      notas: "",
    },
    {
      nombre: "Laura",
      apellido: "Rivas",
      telefono: "2235558899",
      barrioId: sur?.id ?? centro.id,
      notas: "Vecinal",
    },
    {
      nombre: "Diego",
      apellido: "Acosta",
      telefono: "541134445566",
      barrioId: centro.id,
      notas: "",
    },
    {
      nombre: "Silvia",
      apellido: "Ortiz",
      telefono: "91144445555",
      barrioId: oeste?.id ?? centro.id,
      notas: "",
    },
  ];

  for (const row of demo) {
    const tel = normalizarTelefono(row.telefono);
    await prisma.contacto.create({
      data: {
        nombre: row.nombre,
        apellido: row.apellido,
        telefono: tel,
        telefonoClave10: telefonoClave10(row.telefono),
        barrioId: row.barrioId,
        referenteId: refDemo.id,
        notas: row.notas || null,
      },
    });
  }

  console.log(`Seed OK: ${BARRIOS_JARDIN_AMERICA.length} barrios, ${demo.length} contactos demo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
