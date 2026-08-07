import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Le pagine si riaggiornano da sole ogni 10 minuti. Questa route serve per non
 * aspettare: dopo aver corretto un orario nel foglio, apri
 * `/api/revalidate?secret=…` e la modifica è online subito.
 *
 * Il segreto sta solo in `REVALIDATE_SECRET` su Vercel. Senza, la route è spenta:
 * meglio non poter forzare l'aggiornamento che lasciare a chiunque la possibilità
 * di far ripartire i fetch verso Google a ripetizione.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET non è configurato." },
      { status: 501 },
    );
  }

  if (request.nextUrl.searchParams.get("secret") !== expected) {
    return NextResponse.json({ ok: false, error: "Segreto non valido." }, { status: 401 });
  }

  revalidateTag("sheet", "max");

  return NextResponse.json({ ok: true, revalidated: new Date().toISOString() });
}
