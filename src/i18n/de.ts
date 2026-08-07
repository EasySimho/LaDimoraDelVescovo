import type { Dict } from "./types";

const de: Dict = {
  app: {
    name: "Willkommensbuch",
    tagline: "Alles was Sie brauchen, an einem Ort",
  },
  nav: {
    back: "Zurück",
    home: "Start",
    language: "Sprache",
  },
  sections: {
    benvenuto: { label: "Willkommen", hint: "Ein Gruß von Ihrem Gastgeber" },
    checkin: { label: "Check-in", hint: "So kommen Sie herein" },
    regole: { label: "Hausregeln", hint: "Ein paar wichtige Dinge" },
    posizione: { label: "Lage", hint: "Wo wir sind" },
    trasporti: { label: "Verkehr", hint: "Unterwegs vor Ort" },
    servizi: { label: "Services", hint: "Apotheken, Banken, Wichtiges" },
    attivita: { label: "Aktivitäten", hint: "Was es hier zu tun gibt" },
    ristoranti: { label: "Restaurants", hint: "Wo man gut isst" },
    bar: { label: "Cafés & Bars", hint: "Frühstück und Aperitif" },
    shopping: { label: "Einkaufen", hint: "Supermärkte und Geschäfte" },
    informazioni: { label: "Infos", hint: "Häufige Fragen" },
    video: { label: "Videos", hint: "Kurze praktische Videos" },
    emergenza: { label: "Notfall", hint: "Wichtige Nummern" },
    checkout: { label: "Check-out", hint: "Vor der Abreise" },
    contatti: { label: "Kontakt", hint: "Schreiben oder anrufen" },
  },
  common: {
    call: "Anrufen",
    directions: "Route",
    website: "Website",
    copy: "Kopieren",
    copied: "Kopiert",
    hours: "Öffnungszeiten",
    recommended: "Empfohlen",
    empty: "Hier ist noch nichts. Schauen Sie bald wieder vorbei.",
    walkMinutes: (m) => `${m} Min zu Fuß`,
    meters: (m) => `${m} m`,
    kilometers: (km) => `${km} km`,
    filterAll: "Alle",
    showMore: "Alle anzeigen",
    showLess: "Weniger anzeigen",
  },
  checkin: {
    from: "Check-in ab",
    videoTitle: "So kommen Sie herein",
  },
  checkout: {
    by: "Check-out bis",
  },
  posizione: {
    address: "Adresse",
    openMaps: "In Google Maps öffnen",
  },
  contatti: {
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    hint: "Wir antworten meist innerhalb einer Stunde.",
  },
  emergenza: {
    generic: "Europäische Notrufnummer",
    hint: "Bei unmittelbarer Gefahr wählen Sie 112 — kostenlos von jedem Telefon.",
  },
  video: {
    play: "Abspielen",
    watchOn: "Video ansehen",
  },
};

export default de;
