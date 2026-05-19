import { crearContactoConDedupe } from "@/lib/contacto-create";
import { ensureBarriosCargados } from "@/lib/ensure-barrios";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await ensureBarriosCargados();
    const body = (await req.json()) as { texto?: string };
    const texto = body.texto ?? "";
    const lineas = texto
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    let importados = 0;
    let duplicados = 0;
    const errores: string[] = [];

    const barrios = await prisma.barrio.findMany();
    const barrioPorNombre = new Map(barrios.map((b) => [b.nombre.toLowerCase(), b.id]));

    for (let i = 0; i < lineas.length; i++) {
      const partes = lineas[i].split(",").map((p) => p.trim());
      if (partes.length < 4) {
        errores.push(
          `Línea ${i + 1}: usá nombre,apellido,teléfono,barrio (nombre de barrio exacto de la lista).`,
        );
        continue;
      }
      const [nombre, apellido, tel, barrioNombre, ...rest] = partes;
      const notas = rest.join(",").trim() || null;
      const barrioId = barrioPorNombre.get(barrioNombre.toLowerCase());
      if (!barrioId) {
        errores.push(`Línea ${i + 1}: barrio «${barrioNombre}» no existe en la lista.`);
        continue;
      }

      const result = await crearContactoConDedupe({
        nombre,
        apellido,
        telefono: tel,
        barrioId,
        notas,
      });

      if (result.duplicado) {
        duplicados++;
        continue;
      }
      if (!result.ok) {
        errores.push(`Línea ${i + 1}: ${result.error}`);
        continue;
      }
      importados++;
    }

    if (importados === 0 && duplicados === 0 && errores.length > 0) {
      return NextResponse.json({ ok: false, error: errores[0] }, { status: 400 });
    }

    return NextResponse.json({ ok: true, importados, duplicados, advertencias: errores });
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido o error del servidor." }, { status: 400 });
  }
}
