/**
 * Converte `src/data/fallback.json` nei cinque CSV da importare in Google Sheets,
 * uno per tab. Il senso è che i dati di esempio e il template del foglio non
 * possano divergere: si scrivono una volta sola.
 *
 *   node scripts/genera-template-foglio.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "src/data/fallback.json"), "utf8"));
const outDir = join(root, "sheet-template");
const LANGS = ["it", "en", "fr", "es", "de"];

/** Una cella va quotata se contiene virgole, virgolette o a capo. */
function cell(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(headers, rows) {
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => cell(row[h])).join(","))].join("\n");
  // Il conteggio arriva da `rows`, non dalle righe del file: i testi lunghi
  // contengono a capo veri dentro celle quotate e falserebbero il totale.
  return { csv, count: rows.length };
}

/** Espande `{it, en, …}` nelle colonne `<prefix>_it … <prefix>_de`. */
function spread(prefix, values = {}) {
  return Object.fromEntries(LANGS.map((lang) => [`${prefix}_${lang}`, values[lang] ?? ""]));
}

const langCols = (prefix) => LANGS.map((lang) => `${prefix}_${lang}`);

const tabs = {
  luoghi: toCsv(
    [
      "id", "sezione", "nome", "categoria", "indirizzo", "telefono", "sito", "maps",
      "orari", "distanza_m", "minuti_piedi", "prezzo", "evidenza", "ordine", "attivo",
      ...langCols("desc"),
    ],
    data.luoghi.map((p) => ({
      ...p,
      evidenza: p.evidenza ? "TRUE" : "FALSE",
      attivo: p.attivo === false ? "FALSE" : "TRUE",
      ...spread("desc", p.desc),
    })),
  ),

  info: toCsv(
    ["chiave", ...langCols("val")],
    Object.entries(data.info)
      .filter(([chiave]) => !chiave.startsWith("_"))
      .map(([chiave, val]) => ({ chiave, ...spread("val", val) })),
  ),

  regole: toCsv(
    ["id", "icona", "ordine", ...langCols("testo")],
    data.regole.map((r) => ({ ...r, ...spread("testo", r.testo) })),
  ),

  video: toCsv(
    ["id", "sezione", "piattaforma", "video_id", "durata", "ordine", ...langCols("titolo")],
    data.video.map((v) => ({ ...v, ...spread("titolo", v.titolo) })),
  ),

  faq: toCsv(
    ["id", "ordine", ...langCols("domanda"), ...langCols("risposta")],
    data.faq.map((f) => ({ ...f, ...spread("domanda", f.domanda), ...spread("risposta", f.risposta) })),
  ),
};

mkdirSync(outDir, { recursive: true });
for (const [name, { csv, count }] of Object.entries(tabs)) {
  writeFileSync(join(outDir, `${name}.csv`), `${csv}\n`);
  console.log(`sheet-template/${name}.csv — ${count} righe`);
}
