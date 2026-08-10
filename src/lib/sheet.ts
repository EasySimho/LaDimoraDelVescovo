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

/** In sviluppo disattiviamo la cache per vedere le modifiche al foglio all'istante. */
export const REVALIDATE_SECONDS = process.env.NODE_ENV === "development" ? 0 : 600;

const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Endpoint `gviz` (fallback quando GOOGLE_API_KEY non è impostata).
 */
function tabUrl(tab: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

/**
 * Normalizza le intestazioni: "Distanza M ", "distanza_m", "Distanza-m" e
 * "Distanza (m)" diventano tutte `distanza_m`. Toglie anche gli accenti, così
 * "Attività" non diventa una colonna diversa da "attivita".
 * Se la riga di intestazione del foglio contiene valori concatenati (es. "id osteria..."),
 * estrae la prima parola chiave come nome colonna.
 */
function normalizeHeader(header: string, index: number): string {
  let cleaned = header.trim();
  const firstWord = cleaned.split(/[\s\r\n]+/)[0];
  if (firstWord && firstWord.length > 0) {
    cleaned = firstWord;
  }

  const normalized = cleaned
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `col_${index}`;
}

type Row = Record<string, string | undefined>;

async function fetchTab(tab: string): Promise<Row[]> {
  if (GOOGLE_API_KEY) {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tab)}?key=${GOOGLE_API_KEY}`;
    const res = await fetch(apiUrl, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["sheet"] },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Google Sheets API v4 (tab "${tab}") errore ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as { values?: string[][] };
    const matrix = data.values || [];

    if (matrix.length === 0) return [];

    const rawHeaders = matrix[0] || [];
    const headers = rawHeaders.map((h, i) => normalizeHeader(h, i));

    const rows: Row[] = [];
    for (let r = 1; r < matrix.length; r++) {
      const rowData = matrix[r];
      if (!rowData || rowData.every((cell) => !cell || cell.trim() === "")) {
        continue;
      }
      const rowObj: Row = {};
      headers.forEach((header, colIdx) => {
        const val = rowData[colIdx];
        rowObj[header] = val !== undefined && val !== null && String(val).trim() !== "" ? String(val) : undefined;
      });
      rows.push(rowObj);
    }
    return rows;
  }

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
        `Imposta GOOGLE_API_KEY o condividi il foglio come "Chiunque abbia il link → Visualizzatore".`,
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
  const fallback = fallbackData();

  const results = await Promise.allSettled([
    fetchTab("luoghi"),
    fetchTab("info"),
    fetchTab("regole"),
    fetchTab("video"),
    fetchTab("faq"),
  ]);

  const [luoghiRes, infoRes, regoleRes, videoRes, faqRes] = results;

  const luoghiRows = luoghiRes.status === "fulfilled" ? luoghiRes.value : [];
  const infoRows = infoRes.status === "fulfilled" ? infoRes.value : [];
  const regoleRows = regoleRes.status === "fulfilled" ? regoleRes.value : [];
  const videoRows = videoRes.status === "fulfilled" ? videoRes.value : [];
  const faqRows = faqRes.status === "fulfilled" ? faqRes.value : [];

  const parsedLuoghi = byOrder(validate("luoghi", luoghiRows, PlaceSchema, shape.luoghi) as Place[]).filter(
    (p) => p.attivo,
  );

  const parsedInfo = toInfoMap(validate("info", infoRows, InfoSchema, shape.info));

  const parsedRegole = byOrder(validate("regole", regoleRows, RuleSchema, shape.regole) as Rule[]);

  const parsedVideo = byOrder(validate("video", videoRows, VideoSchema, shape.video) as Video[]).filter(
    (v) => v.video_id,
  );

  const parsedFaq = byOrder(validate("faq", faqRows, FaqSchema, shape.faq) as Faq[]);

  const parsedIds = new Set(parsedLuoghi.map((p) => p.id));
  const mergedLuoghi = [
    ...parsedLuoghi,
    ...fallback.luoghi.filter((p) => !parsedIds.has(p.id)),
  ];

  return {
    luoghi: mergedLuoghi.length > 0 ? mergedLuoghi : fallback.luoghi,
    info: { ...fallback.info, ...parsedInfo },
    regole: parsedRegole.length > 0 ? parsedRegole : fallback.regole,
    video: parsedVideo.length > 0 ? parsedVideo : fallback.video,
    faq: parsedFaq.length > 0 ? parsedFaq : fallback.faq,
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
