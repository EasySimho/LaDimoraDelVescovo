"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getDict, type Lang } from "@/lib/i18n";
import { SECTIONS } from "@/lib/sections";

/**
 * Lo stagger è pensato per il *primo* arrivo dal QR. Se l'ospite torna in home
 * da una sezione, rivedere le tessere apparire una a una sarebbe solo lento: il
 * flag a livello di modulo sopravvive alle navigazioni client-side e spegne
 * l'animazione dalla seconda volta in poi.
 */
let alreadyPlayed = false;

const SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;
const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export function TileGrid({ lang }: { lang: Lang }) {
  const dict = getDict(lang);
  // Fissato al primo render e mai più ricalcolato; il flag condiviso si aggiorna
  // dopo il commit, così il render resta puro.
  const [playIntro] = useState(() => !alreadyPlayed);
  useEffect(() => {
    alreadyPlayed = true;
  }, []);

  return (
    /* Le sezioni sono 15: tre colonne le dispongono in cinque righe piene,
       senza tessere spaiate in fondo. */
    <motion.ul
      className="grid grid-cols-3 gap-3"
      initial={playIntro ? "hidden" : false}
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: 0.04 } } }}
    >
      {SECTIONS.map(({ key, icon: Icon }) => (
        <motion.li
          key={key}
          variants={{
            hidden: { opacity: 0, y: 12 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_SOFT } },
          }}
        >
          <motion.div whileTap={{ scale: 0.955 }} transition={SPRING}>
            <Link
              href={`/${lang}/${key}`}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-tile border border-bordo bg-panna-2 px-1.5 text-center transition-colors active:bg-panna-3"
            >
              <Icon size={26} strokeWidth={1.5} className="text-rosso" aria-hidden />
              <span className="text-[0.72rem] font-medium leading-tight text-inchiostro">
                {dict.sections[key].label}
              </span>
            </Link>
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
