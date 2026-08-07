import { z } from "zod";
import { LANGS, type Lang } from "./i18n";

/**
 * Il foglio è compilato a mano da chi gestisce la casa, non da uno sviluppatore.
 * Ogni campo è quindi il più permissivo possibile: si scarta una riga solo se
 * manca l'informazione senza la quale la card non ha senso (il nome, il testo).
 * Tutto il resto degrada in silenzio.
 */

/** Testo opzionale: spazi tolti, cella vuota → undefined. */
const text = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    return trimmed ? trimmed : undefined;
  });

/** Intero opzionale. Accetta "1.200" e "1,200" perché Excel/Sheets li produce. */
const int = z
  .string()
  .optional()
  .transform((v) => {
    const raw = v?.trim().replace(/[.\s]/g, "").replace(",", ".");
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.round(n) : undefined;
  });

const float = z
  .string()
  .optional()
  .transform((v) => {
    const raw = v?.trim().replace(",", ".");
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  });

const TRUTHY = new Set(["true", "vero", "si", "sì", "yes", "oui", "ja", "x", "1"]);
const FALSY = new Set(["false", "falso", "no", "nein", "non", "0"]);

/** Booleano tollerante. Cella vuota o colonna assente → `fallback`. */
const bool = (fallback: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => {
      const raw = v?.trim().toLowerCase();
      if (!raw) return fallback;
      if (TRUTHY.has(raw)) return true;
      if (FALSY.has(raw)) return false;
      return fallback;
    });

/** Accetta solo http(s); un "www.tizio.it" viene completato invece che scartato. */
const url = z
  .string()
  .optional()
  .transform((v) => {
    const raw = v?.trim();
    if (!raw) return undefined;
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withProtocol).toString();
    } catch {
      return undefined;
    }
  });

/** Raccoglie le colonne `<prefix>_it … <prefix>_de` in un unico oggetto. */
function multilang(row: Record<string, string | undefined>, prefix: string) {
  const out: Partial<Record<Lang, string>> = {};
  for (const lang of LANGS) {
    const value = row[`${prefix}_${lang}`]?.trim();
    if (value) out[lang] = value;
  }
  return out;
}

/**
 * `multilang()` costruisce già un oggetto sicuro (solo chiavi lingua, solo
 * stringhe non vuote), quindi qui basta accettarlo e restringere il tipo: una
 * validazione per-lingua scarterebbe le righe compilate a metà, che invece
 * vogliamo tenere e servire con il fallback di `pick()`.
 */
const MultilangSchema = z
  .record(z.string(), z.string())
  .default({})
  .transform((v) => v as Partial<Record<Lang, string>>);

// ---------------------------------------------------------------- luoghi

export const PLACE_SECTIONS = [
  "trasporti",
  "servizi",
  "attivita",
  "ristoranti",
  "bar",
  "shopping",
  "emergenza",
] as const;

export type PlaceSection = (typeof PLACE_SECTIONS)[number];

export const PlaceSchema = z
  .object({
    id: text,
    sezione: z.string().transform((v) => v.trim().toLowerCase()),
    nome: z.string().transform((v) => v.trim()),
    categoria: text,
    indirizzo: text,
    telefono: text,
    sito: url,
    maps: url,
    orari: text,
    distanza_m: int,
    minuti_piedi: int,
    prezzo: text,
    evidenza: bool(false),
    ordine: int,
    attivo: bool(true),
    desc: MultilangSchema,
  })
  .refine((v) => v.nome.length > 0, { message: "nome mancante" })
  .refine((v) => (PLACE_SECTIONS as readonly string[]).includes(v.sezione), {
    message: `sezione non valida (attese: ${PLACE_SECTIONS.join(", ")})`,
  });

export type Place = Omit<z.infer<typeof PlaceSchema>, "sezione"> & {
  sezione: PlaceSection;
};

// ---------------------------------------------------------------- info

export const InfoSchema = z.object({
  chiave: z.string().transform((v) => v.trim().toLowerCase()),
  val: MultilangSchema,
});

export type InfoRow = z.infer<typeof InfoSchema>;
export type InfoMap = Record<string, Partial<Record<Lang, string>>>;

// ---------------------------------------------------------------- regole

export const RuleSchema = z.object({
  id: text,
  icona: text,
  ordine: int,
  testo: MultilangSchema,
});

export type Rule = z.infer<typeof RuleSchema>;

// ---------------------------------------------------------------- video

export const VideoSchema = z.object({
  id: text,
  sezione: text,
  piattaforma: z
    .string()
    .optional()
    .transform((v) => (v?.trim().toLowerCase() === "vimeo" ? "vimeo" : "youtube")),
  video_id: z.string().transform((v) => v.trim()),
  durata: text,
  ordine: int,
  verticale: bool(true),
  titolo: MultilangSchema,
});

export type Video = z.infer<typeof VideoSchema>;

// ---------------------------------------------------------------- faq

export const FaqSchema = z.object({
  id: text,
  ordine: int,
  domanda: MultilangSchema,
  risposta: MultilangSchema,
});

export type Faq = z.infer<typeof FaqSchema>;

// ---------------------------------------------------------------- shaping

type Row = Record<string, string | undefined>;

/** Trasforma una riga CSV piatta nella forma attesa dagli schemi sopra. */
export const shape = {
  luoghi: (row: Row) => ({ ...row, desc: multilang(row, "desc") }),
  info: (row: Row) => ({ ...row, val: multilang(row, "val") }),
  regole: (row: Row) => ({ ...row, testo: multilang(row, "testo") }),
  video: (row: Row) => ({ ...row, titolo: multilang(row, "titolo") }),
  faq: (row: Row) => ({
    ...row,
    domanda: multilang(row, "domanda"),
    risposta: multilang(row, "risposta"),
  }),
};

export const coord = float;

export type GuestBookData = {
  luoghi: Place[];
  info: InfoMap;
  regole: Rule[];
  video: Video[];
  faq: Faq[];
};
