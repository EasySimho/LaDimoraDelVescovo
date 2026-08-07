# La Dimora del Vescovo — Libro di Benvenuto

Webapp mobile-first per gli ospiti: si inquadra un QR in appartamento e si trova
tutto quello che serve — check-in, regole, video guida e i locali della zona
(ristoranti, bar, supermercati, farmacie, trasporti) — in 5 lingue.

Nessun login, nessuna landing page. I contenuti si aggiornano da un **Google
Sheet**, senza toccare il codice.

---

## Come funziona in due righe

Le pagine sono statiche e si rigenerano da sole leggendo il foglio **ogni 10
minuti**. Modifichi una riga, aspetti, ed è online. Se hai fretta c'è un
[aggiornamento immediato](#aggiornare-subito-dopo-una-modifica).

Se il foglio non risponde, la webapp serve i dati di esempio committati in
`src/data/fallback.json`: **non va giù per colpa di Google**.

---

## 1. Preparare il Google Sheet

1. Crea un foglio nuovo su Google Sheets.
2. Crea cinque tab con **esattamente** questi nomi (minuscoli):
   `luoghi` · `info` · `regole` · `video` · `faq`
3. In ogni tab: **File → Importa → Carica** il CSV corrispondente da
   `sheet-template/`, scegliendo *"Sostituisci foglio corrente"*.
   Trovi già dentro dei dati di esempio da sovrascrivere con i tuoi.
4. **Condividi → Accesso generale → Chiunque abbia il link → Visualizzatore.**
   Senza questo passaggio l'app non riesce a leggere il foglio.
5. Copia l'id del foglio dall'URL — è il pezzo tra `/d/` e `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`QUESTO_PEZZO`**`/edit`

### Le colonne che contano

**`luoghi`** — ristoranti, bar, supermercati, farmacie, trasporti…

| colonna | cosa metterci |
|---|---|
| `sezione` | una di: `ristoranti` `bar` `shopping` `attivita` `servizi` `trasporti` `emergenza` |
| `categoria` | una chiave dall'elenco in [`src/i18n/categories.ts`](src/i18n/categories.ts) — es. `supermercato`, `pizzeria`, `farmacia`. La traduce l'app. |
| `distanza_m` `minuti_piedi` | solo numeri: "350 m · 5 min a piedi" lo compone l'app, tradotto |
| `evidenza` | `TRUE` per i consigliati dall'host: salgono in cima con la stellina |
| `attivo` | `FALSE` per nascondere una riga senza cancellarla |
| `desc_it … desc_de` | **l'unica cosa da tradurre a mano.** Nome, indirizzo, telefono e orari restano uguali in tutte le lingue. |

**`info`** — coppie chiave/valore: `casa_nome`, `casa_sottotitolo`,
`benvenuto_testo`, `checkin_orario`, `checkin_testo`, `checkout_orario`,
`checkout_testo`, `indirizzo_casa`, `coord_lat`, `coord_lng`, `telefono_host`,
`whatsapp_host`, `email_host`.

**`video`** — `piattaforma` (`youtube` o `vimeo`), `video_id` (solo l'id, non
l'URL intero) e `sezione` per farlo comparire anche dentro quella sezione.

Nei testi lunghi puoi usare **a capo** (Alt+Invio nella cella), elenchi che
iniziano con `- ` e `**grassetto**` per codici e orari.

> Se sbagli a scrivere qualcosa, quella riga viene saltata e le altre restano:
> il sito non si rompe mai. L'errore compare nei log di Vercel.

---

## 2. Sviluppo in locale

```bash
npm install
```

Copia `.env.example` in `.env.local` e metti il tuo `SHEET_ID`. Senza, parte
comunque con i dati di esempio.

```bash
npm run dev
```

---

## 3. Deploy su Vercel

```bash
git init && git add -A && git commit -m "Libro di benvenuto"
```

Poi crea un repo su GitHub, fai push, e su [vercel.com/new](https://vercel.com/new)
importa il repo — Next.js viene riconosciuto da solo.

In **Settings → Environment Variables** aggiungi:

| variabile | valore |
|---|---|
| `SHEET_ID` | l'id copiato al passo 1 |
| `REVALIDATE_SECRET` | una parola lunga che scegli tu |

Fatto. L'URL che ti dà Vercel è quello da mettere nel QR code in casa.

### Aggiornare subito dopo una modifica

Apri nel browser, una volta sola:

```
https://IL-TUO-DOMINIO.vercel.app/api/revalidate?secret=LA_TUA_PAROLA
```

Ricarica la webapp e i contenuti nuovi ci sono.

---

## Struttura

```
src/
├─ app/[lang]/            home (griglia 15 sezioni) e [section]
├─ components/            tessere, schede luogo, video, mappa, accordion
├─ lib/
│  ├─ sheet.ts            lettura del foglio, cache, fallback
│  ├─ schema.ts           validazione tollerante delle righe
│  ├─ sections.ts         le 15 sezioni e il renderer di ognuna
│  └─ i18n.ts             lingue e fallback delle traduzioni
├─ i18n/                  testi dell'interfaccia (it, en, fr, es, de)
└─ data/fallback.json     dati di esempio / rete di sicurezza
```

Per aggiungere una sezione: una riga in `src/lib/sections.ts`, l'etichetta nei
cinque file di `src/i18n/`. Il resto è automatico.

Se cambi `src/data/fallback.json`, rigenera i CSV del template:

```bash
node scripts/genera-template-foglio.mjs
```

---

## Da sapere

**Il libro è pubblico.** Non c'è login: chiunque abbia l'URL vede i contenuti,
comprese le istruzioni di check-in. È lo standard per i libri di benvenuto con
QR in casa, ma tieni fuori dal foglio i codici che non vuoi in giro (cassaforte,
allarme) e dalli di persona.

**Le password del wifi si danno in loco**, quindi la sezione non esiste.

**I video** non caricano niente di YouTube finché l'ospite non tocca play: si
vede solo la copertina. La sezione resta leggera anche con dieci video.
