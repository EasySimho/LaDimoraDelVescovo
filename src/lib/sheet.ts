import Papa from "papaparse";
import { cache } from "react";

import fallback from "@/data/fallback.json";
import {
  FaqSchema,
  InfoSchema,
  PlaceSchema,
  RuleSchema,
  VideoSchema,
  shape,
  type Faq,
  type GuestBookData,
  type InfoMap,
  type Place,
  type Rule,
  type Video,
} from "./schema";

/** Ogni pagina si rigenera al massimo ogni 10 minuti (vedi `revalidate` nelle page). */
export const REVALIDATE_SECONDS = 600;

const SHEET_ID = process.env.SHEET_ID;

/**
 * Endpoint `gviz`: legge un foglio condiviso in sola lettura ("chiunque abbia il
 * link") senza API key né service account, e indirizza i tab **per nome** — così
 * aggiungere un tab non richiede di scoprire e configurare il suo `gid`.
 */
function tabUrl(tab: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

/**
 * Normalizza le intestazioni: "Distanza M ", "distanza_m", "Distanza-m" e
 * "Distanza (m)" diventano tutte `distanza_m`. Toglie anche gli accenti, così
 * "Attività" non diventa una colonna diversa da "attivita".
 */
function normalizeHeader(header: string): string {
  return header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

type Row = Record<string, string | undefined>;

async function fetchTab(tab: string): Promise<Row[]> {
  const res = await fetch(tabUrl(tab), {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["sheet"] },
  });

  if (!res.ok) {
    throw new Error(`Google Sheet: tab "${tab}" ha risposto ${res.status}`);
  }

  const csv = await res.text();

  // Un foglio non condiviso restituisce 200 con una pagina di login HTML.
  if (csv.trimStart().startsWith("<")) {
    throw new Error(
      `Google Sheet: tab "${tab}" non è leggibile pubblicamente. ` +
        `Condividi il foglio come "Chiunque abbia il link → Visualizzatore".`,
    );
  }

  const parsed = Papa.parse<Row>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
  });

  return parsed.data;
}

/**
 * Basta questo di uno schema zod: `reshape` produce un oggetto più largo di una
 * riga CSV (le colonne `desc_*` diventano un oggetto annidato), quindi legare il
 * tipo d'ingresso a `Row` non funzionerebbe — e in ingresso `safeParse` accetta
 * comunque `unknown`.
 */
type Validator<TOut> = {
  safeParse: (
    input: unknown,
  ) => { success: true; data: TOut } | { success: false; error: { issues: { message: string }[] } };
};

/**
 * Valida riga per riga. Una riga rotta viene scartata con un warning nei log di
 * build/runtime: un refuso nel foglio non deve mai far cadere il sito.
 */
function validate<TOut>(
  tab: string,
  rows: Row[],
  schema: Validator<TOut>,
  reshape: (row: Row) => unknown,
): TOut[] {
  const out: TOut[] = [];

  rows.forEach((row, index) => {
    const result = schema.safeParse(reshape(row));
    if (result.success) {
      out.push(result.data);
    } else {
      const reason = result.error.issues.map((i) => i.message).join("; ");
      console.warn(`[sheet] ${tab}: riga ${index + 2} scartata — ${reason}`);
    }
  });

  return out;
}

/** Ordina per la colonna `ordine`; le righe senza ordine finiscono in fondo. */
function byOrder<T extends { ordine?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.ordine ?? 9999) - (b.ordine ?? 9999));
}

function toInfoMap(rows: { chiave: string; val: Record<string, string | undefined> }[]): InfoMap {
  const map: InfoMap = {};
  for (const row of rows) {
    if (row.chiave) map[row.chiave] = row.val;
  }
  return map;
}

/** I dati di esempio committati: usati in dev senza `SHEET_ID` e se il foglio è irraggiungibile. */
function fallbackData(): GuestBookData {
  return fallback as unknown as GuestBookData;
}

async function loadFromSheet(): Promise<GuestBookData> {
  const [luoghi, info, regole, video, faq] = await Promise.all([
    fetchTab("luoghi"),
    fetchTab("info"),
    fetchTab("regole"),
    fetchTab("video"),
    fetchTab("faq"),
  ]);

  return {
    luoghi: byOrder(validate("luoghi", luoghi, PlaceSchema, shape.luoghi) as Place[]).filter(
      (p) => p.attivo,
    ),
    info: toInfoMap(validate("info", info, InfoSchema, shape.info)),
    regole: byOrder(validate("regole", regole, RuleSchema, shape.regole) as Rule[]),
    video: byOrder(validate("video", video, VideoSchema, shape.video) as Video[]).filter(
      (v) => v.video_id,
    ),
    faq: byOrder(validate("faq", faq, FaqSchema, shape.faq) as Faq[]),
  };
}

/**
 * `cache()` deduplica le chiamate dentro la stessa richiesta: home e sezione
 * condividono un solo fetch del foglio anche se lo chiedono entrambe.
 */
export const getData = cache(async (): Promise<GuestBookData> => {
  if (!SHEET_ID) {
    console.warn("[sheet] SHEET_ID non impostato — uso i dati di esempio.");
    return fallbackData();
  }

  try {
    return await loadFromSheet();
  } catch (error) {
    console.error("[sheet] lettura fallita, servo i dati di esempio:", error);
    return fallbackData();
  }
});

export async function getPlaces(sezione: string): Promise<Place[]> {
  const { luoghi } = await getData();
  return luoghi.filter((p) => p.sezione === sezione);
}

export async function getVideos(sezione?: string): Promise<Video[]> {
  const { video } = await getData();
  return sezione ? video.filter((v) => v.sezione === sezione) : video;
}
