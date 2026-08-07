"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getDict, isLang, LANGS, LANG_META, type Lang } from "@/lib/i18n";

const STORAGE_KEY = "guestbook.lang";

export function LangSwitcher({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const dict = getDict(lang);

  /* Il middleware indovina la lingua dall'header del telefono solo la prima
     volta. Da qui in poi comanda la scelta esplicita dell'ospite, che ricordiamo
     tra una visita e l'altra. */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isLang(saved) && saved !== lang) {
      router.replace(swapLang(pathname, saved));
    }
    // Volutamente solo al mount: dopo, la lingua la cambia `select`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function select(next: Lang) {
    localStorage.setItem(STORAGE_KEY, next);
    setOpen(false);
    router.push(swapLang(pathname, next));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.nav.language}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-bordo bg-panna-2 py-1.5 pl-2.5 pr-3 text-sm transition-colors active:bg-panna-3"
      >
        <span aria-hidden className="text-base leading-none">
          {LANG_META[lang].flag}
        </span>
        <span className="font-medium uppercase tracking-wide">{lang}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-40 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-bordo bg-panna shadow-lg shadow-inchiostro/10"
          >
            {LANGS.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => select(code)}
                  aria-current={code === lang}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors active:bg-panna-3 ${
                    code === lang ? "bg-rosso-tenue font-medium text-rosso" : ""
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {LANG_META[code].flag}
                  </span>
                  {LANG_META[code].name}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** `/de/ristoranti` → `/it/ristoranti`: cambia la lingua restando sulla stessa sezione. */
function swapLang(pathname: string, next: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = next;
  return `/${segments.join("/")}`;
}
