import { ExternalLink, MapPin } from "lucide-react";

import { getDict, type Lang } from "@/lib/i18n";

export const PROPERTY_ADDRESS = "Via Vescovado 16, 13900 Biella (BI)";
export const PROPERTY_LAT = 45.565351;
export const PROPERTY_LNG = 8.05345;
export const PROPERTY_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PROPERTY_ADDRESS)}`;

/**
 * Mappa della struttura. Il punto e il link a Google Maps puntano sempre
 * all'indirizzo ufficiale della Dimora del Vescovo (Via Vescovado 16, 13900 Biella (BI)),
 * indipendentemente dai dati del foglio Excel.
 */
export function MapCard({
  lang,
  address = PROPERTY_ADDRESS,
  lat = PROPERTY_LAT,
  lng = PROPERTY_LNG,
}: {
  lang: Lang;
  address?: string;
  lat?: number;
  lng?: number;
}) {
  const dict = getDict(lang);
  const displayAddress = PROPERTY_ADDRESS;
  const currentLat = lat ?? PROPERTY_LAT;
  const currentLng = lng ?? PROPERTY_LNG;

  // Il link della mappa deve mandare obbligatoriamente a Via Vescovado 16, 13900 Biella (BI)
  const mapsHref = PROPERTY_MAPS_URL;

  // Riquadro di ~600 m di lato attorno al marker: abbastanza stretto da
  // riconoscere la via, abbastanza largo da capire dove si è.
  const delta = 0.004;
  const bbox = [
    currentLng - delta,
    currentLat - delta / 2,
    currentLng + delta,
    currentLat + delta / 2,
  ].join(",");

  return (
    <div className="space-y-4">
      <div className="card flex items-start gap-3 p-4">
        <MapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-rosso" aria-hidden />
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-wider text-fumo">
            {dict.posizione.address}
          </p>
          <p className="mt-1 text-[1rem] font-medium leading-snug">{displayAddress}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <iframe
          title={dict.sections.posizione.label}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${currentLat},${currentLng}`}
          loading="lazy"
          className="aspect-[4/3] w-full border-0"
        />
      </div>

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
