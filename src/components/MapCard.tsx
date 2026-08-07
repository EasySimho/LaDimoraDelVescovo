import { ExternalLink, MapPin } from "lucide-react";

import { getDict, type Lang } from "@/lib/i18n";

/**
 * Mappa via OpenStreetMap: nessuna API key da gestire e nessun costo che cresce
 * con gli ospiti, che è quello che succederebbe con l'embed di Google. Per le
 * indicazioni vere mandiamo comunque a Google Maps, che è quello che l'ospite
 * ha già sul telefono.
 */
export function MapCard({
  lang,
  address,
  lat,
  lng,
}: {
  lang: Lang;
  address?: string;
  lat?: number;
  lng?: number;
}) {
  const dict = getDict(lang);
  const hasCoords = lat !== undefined && lng !== undefined;

  const mapsHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address ?? "")}`;

  // Riquadro di ~600 m di lato attorno al marker: abbastanza stretto da
  // riconoscere la via, abbastanza largo da capire dove si è.
  const delta = 0.004;
  const bbox = hasCoords
    ? [lng - delta, lat - delta / 2, lng + delta, lat + delta / 2].join(",")
    : null;

  return (
    <div className="space-y-4">
      {address && (
        <div className="card flex items-start gap-3 p-4">
          <MapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-rosso" aria-hidden />
          <div>
            <p className="text-[0.72rem] font-medium uppercase tracking-wider text-fumo">
              {dict.posizione.address}
            </p>
            <p className="mt-1 text-[1rem] font-medium leading-snug">{address}</p>
          </div>
        </div>
      )}

      {bbox && (
        <div className="card overflow-hidden">
          <iframe
            title={dict.sections.posizione.label}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
            loading="lazy"
            className="aspect-[4/3] w-full border-0"
          />
        </div>
      )}

      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-rosso px-4 py-3.5 text-[0.92rem] font-semibold text-panna transition-colors active:bg-rosso-scuro"
      >
        {dict.posizione.openMaps}
        <ExternalLink size={15} strokeWidth={2} aria-hidden />
      </a>
    </div>
  );
}
