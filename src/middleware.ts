import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LANG, LANGS } from "@/lib/i18n";

/**
 * Non esiste una pagina su `/`: l'unica root è `/[lang]`. Qui indoviniamo la
 * lingua dell'ospite dall'header `Accept-Language` del telefono — chi arriva dal
 * QR con un telefono tedesco atterra su `/de` senza toccare niente — e
 * ripieghiamo sull'italiano se non riconosciamo nulla.
 */
function negotiate(header: string | null): string {
  if (!header) return DEFAULT_LANG;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if ((LANGS as readonly string[]).includes(base)) return base;
  }

  return DEFAULT_LANG;
}

export function middleware(request: NextRequest) {
  const lang = negotiate(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}

/** Solo la root: tutto il resto (asset, `_next`, manifest, API) passa intatto. */
export const config = {
  matcher: "/",
};
