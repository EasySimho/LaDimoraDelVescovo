import it from "@/i18n/it";
import en from "@/i18n/en";
import fr from "@/i18n/fr";
import es from "@/i18n/es";
import de from "@/i18n/de";
import type { Dict } from "@/i18n/types";

export const LANGS = ["it", "en", "fr", "es", "de"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "it";

export const LANG_META: Record<Lang, { flag: string; name: string; locale: string }> = {
  it: { flag: "🇮🇹", name: "Italiano", locale: "it-IT" },
  en: { flag: "🇬🇧", name: "English", locale: "en-GB" },
  fr: { flag: "🇫🇷", name: "Français", locale: "fr-FR" },
  es: { flag: "🇪🇸", name: "Español", locale: "es-ES" },
  de: { flag: "🇩🇪", name: "Deutsch", locale: "de-DE" },
};

const DICTS: Record<Lang, Dict> = { it, en, fr, es, de };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/**
 * Sceglie il testo nella lingua richiesta con fallback a cascata:
 * lingua richiesta → inglese → italiano → primo valore non vuoto.
 * Serve perché l'host può compilare il foglio a metà senza rompere le pagine.
 */
export function pick(
  values: Partial<Record<Lang, string | undefined>>,
  lang: Lang,
): string {
  const chain: Lang[] = [lang, "en", "it"];
  for (const candidate of chain) {
    const value = values[candidate]?.trim();
    if (value) return value;
  }
  for (const value of Object.values(values)) {
    if (value?.trim()) return value.trim();
  }
  return "";
}
