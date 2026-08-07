const it = {
  app: {
    name: "Libro di Benvenuto",
    tagline: "Tutto quello che ti serve, in un posto solo",
  },
  nav: {
    back: "Indietro",
    home: "Home",
    language: "Lingua",
  },
  sections: {
    benvenuto: { label: "Benvenuto", hint: "Un saluto dal tuo host" },
    checkin: { label: "Check-in", hint: "Come entrare in casa" },
    regole: { label: "Regole", hint: "Poche cose importanti" },
    posizione: { label: "Posizione", hint: "Dove siamo" },
    trasporti: { label: "Trasporti", hint: "Muoversi in zona" },
    servizi: { label: "Servizi", hint: "Farmacie, banche, utilità" },
    attivita: { label: "Attività", hint: "Cosa fare qui intorno" },
    ristoranti: { label: "Ristoranti", hint: "Dove mangiare bene" },
    bar: { label: "Bar", hint: "Colazione e aperitivo" },
    shopping: { label: "Shopping", hint: "Supermercati e negozi" },
    informazioni: { label: "Informazioni", hint: "Domande frequenti" },
    video: { label: "Video guide", hint: "Brevi video pratici" },
    emergenza: { label: "Emergenza", hint: "Numeri utili" },
    checkout: { label: "Check-out", hint: "Prima di partire" },
    contatti: { label: "Contatti", hint: "Scrivici o chiamaci" },
  },
  common: {
    call: "Chiama",
    directions: "Indicazioni",
    website: "Sito",
    copy: "Copia",
    copied: "Copiato",
    hours: "Orari",
    recommended: "Consigliato",
    empty: "Ancora niente in questa sezione. Torna presto.",
    walkMinutes: (m: number) => `${m} min a piedi`,
    meters: (m: number) => `${m} m`,
    kilometers: (km: string) => `${km} km`,
    filterAll: "Tutti",
    showMore: "Mostra tutto",
    showLess: "Mostra meno",
  },
  checkin: {
    from: "Check-in dalle",
    videoTitle: "Guarda come si entra",
  },
  checkout: {
    by: "Check-out entro le",
  },
  posizione: {
    address: "Indirizzo",
    openMaps: "Apri in Google Maps",
  },
  contatti: {
    phone: "Telefono",
    whatsapp: "WhatsApp",
    email: "Email",
    hint: "Rispondiamo di solito entro un'ora.",
  },
  emergenza: {
    generic: "Numero unico emergenze",
    hint: "In caso di pericolo immediato chiama il 112, gratuito da qualsiasi telefono.",
  },
  video: {
    play: "Riproduci",
    watchOn: "Guarda il video",
  },
} as const;

export default it;
