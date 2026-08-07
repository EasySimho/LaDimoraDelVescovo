"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LangSwitcher } from "./LangSwitcher";
import { getDict, type Lang } from "@/lib/i18n";

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const dict = getDict(lang);
  const isHome = pathname === `/${lang}`;

  return (
    <header className="sticky top-0 z-30 border-b border-bordo/70 bg-panna/85 backdrop-blur-md">
      <div className="shell flex h-14 items-center gap-2">
        {isHome ? (
          <span className="truncate font-display text-[0.95rem] font-medium tracking-tight text-fumo">
            {dict.app.name}
          </span>
        ) : (
          <Link
            href={`/${lang}`}
            aria-label={dict.nav.back}
            className="-ml-2 flex items-center gap-1 rounded-full py-2 pl-1 pr-3 text-rosso transition-colors active:bg-rosso-tenue"
          >
            <ChevronLeft size={22} strokeWidth={2.25} />
            <span className="text-sm font-medium">{dict.nav.back}</span>
          </Link>
        )}

        <div className="ml-auto shrink-0">
          <LangSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}
