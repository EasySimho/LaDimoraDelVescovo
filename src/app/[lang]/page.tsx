import { notFound } from "next/navigation";

import { TileGrid } from "@/components/TileGrid";
import { getDict, isLang, pick, type Lang } from "@/lib/i18n";
import { getData } from "@/lib/sheet";

// Next impone un letterale statico qui, quindi il valore non può arrivare da
// `REVALIDATE_SECONDS`: se lo cambi, cambialo anche in `lib/sheet.ts`.
export const revalidate = 600;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const typedLang = lang as Lang;
  const dict = getDict(typedLang);
  const { info } = await getData();

  const houseName = info.casa_nome?.it ?? dict.app.name;
  const subtitle = pick(info.casa_sottotitolo ?? {}, typedLang);

  return (
    <div className="pt-7">
      {/* Il nome dell'app sta già nell'header: qui l'ospite deve leggere subito
          dove si trova, non ripetere due volte la stessa riga. */}
      <section className="mb-7">
        <h1 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-tight text-inchiostro">
          {houseName}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-fumo">{subtitle}</p>}
      </section>

      <TileGrid lang={typedLang} />
    </div>
  );
}
