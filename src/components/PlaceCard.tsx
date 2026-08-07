import { Clock, Globe, MapPin, Phone, Star } from "lucide-react";

import { categoryLabel } from "@/i18n/categories";
import { getDict, pick, type Lang } from "@/lib/i18n";
import type { Place } from "@/lib/schema";

/** Se l'host non ha messo un link Maps, lo costruiamo dall'indirizzo o dal nome. */
function mapsUrl(place: Place): string {
  if (place.maps) return place.maps;
  const query = place.indirizzo ? `${place.nome}, ${place.indirizzo}` : place.nome;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Sotto il chilometro si legge meglio in metri; sopra, in km con un decimale. */
function formatDistance(meters: number, lang: Lang): string {
  const dict = getDict(lang);
  if (meters < 1000) return dict.common.meters(Math.round(meters / 10) * 10);
  return dict.common.kilometers((meters / 1000).toFixed(1).replace(".", ","));
}

export function PlaceCard({ place, lang }: { place: Place; lang: Lang }) {
  const dict = getDict(lang);
  const description = pick(place.desc, lang);
  const category = place.categoria ? categoryLabel(place.categoria, lang) : undefined;

  const meta = [
    place.distanza_m !== undefined ? formatDistance(place.distanza_m, lang) : null,
    place.minuti_piedi !== undefined ? dict.common.walkMinutes(place.minuti_piedi) : null,
    place.prezzo ?? null,
  ].filter(Boolean);

  return (
    <article className="card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
              {place.nome}
            </h3>
            {category && (
              <p className="mt-0.5 text-[0.78rem] font-medium uppercase tracking-wider text-rosso">
                {category}
              </p>
            )}
          </div>

          {place.evidenza && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-rosso-tenue px-2.5 py-1 text-[0.68rem] font-semibold text-rosso">
              <Star size={11} strokeWidth={2.5} className="fill-current" aria-hidden />
              {dict.common.recommended}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-inchiostro/85">{description}</p>
        )}

        {meta.length > 0 && (
          <p className="mt-2.5 text-[0.8rem] text-fumo">{meta.join(" · ")}</p>
        )}

        {place.orari && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[0.8rem] text-fumo">
            <Clock size={13} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
            <span>{place.orari}</span>
          </p>
        )}
      </div>

      <div className="flex divide-x divide-bordo border-t border-bordo bg-panna/60">
        {place.telefono && (
          <Action href={`tel:${place.telefono.replace(/\s/g, "")}`} icon={Phone} label={dict.common.call} />
        )}
        <Action href={mapsUrl(place)} icon={MapPin} label={dict.common.directions} external />
        {place.sito && (
          <Action href={place.sito} icon={Globe} label={dict.common.website} external />
        )}
      </div>
    </article>
  );
}

function Action({
  href,
  icon: Icon,
  label,
  external = false,
}: {
  href: string;
  icon: typeof Phone;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[0.82rem] font-medium text-rosso transition-colors active:bg-rosso-tenue"
    >
      <Icon size={15} strokeWidth={2} aria-hidden />
      {label}
    </a>
  );
}
