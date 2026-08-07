"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { PlaceCard } from "./PlaceCard";
import { categoryLabel } from "@/i18n/categories";
import { getDict, type Lang } from "@/lib/i18n";
import type { Place } from "@/lib/schema";

/** Sotto questa soglia i filtri sono solo rumore: si vede tutto in una schermata. */
const MIN_ITEMS_FOR_FILTERS = 5;

export function PlaceList({ places, lang }: { places: Place[]; lang: Lang }) {
  const dict = getDict(lang);
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const place of places) {
      if (place.categoria && !seen.has(place.categoria)) {
        seen.set(place.categoria, categoryLabel(place.categoria, lang));
      }
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], lang));
  }, [places, lang]);

  const showFilters = categories.length > 1 && places.length >= MIN_ITEMS_FOR_FILTERS;

  // I "consigliati dall'host" salgono in cima, il resto tiene l'ordine del foglio.
  const ordered = useMemo(() => {
    const visible = active ? places.filter((p) => p.categoria === active) : places;
    return [...visible].sort((a, b) => Number(b.evidenza) - Number(a.evidenza));
  }, [places, active]);

  if (places.length === 0) {
    return <p className="card p-4 text-sm text-fumo">{dict.common.empty}</p>;
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        /* Scorre oltre il padding del guscio: le chip devono poter "uscire" dai
           bordi, altrimenti su schermi stretti sembrano tagliate a metà. */
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 pb-0.5">
            <Chip active={active === null} onClick={() => setActive(null)}>
              {dict.common.filterAll}
            </Chip>
            {categories.map(([key, label]) => (
              <Chip key={key} active={active === key} onClick={() => setActive(key)}>
                {label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {ordered.map((place, index) => (
            <motion.li
              key={place.id ?? `${place.nome}-${index}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlaceCard place={place} lang={lang} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors ${
        active
          ? "border-rosso bg-rosso text-panna"
          : "border-bordo bg-panna-2 text-inchiostro active:bg-panna-3"
      }`}
    >
      {children}
    </button>
  );
}
