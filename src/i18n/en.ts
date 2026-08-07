import type { Dict } from "./types";

const en: Dict = {
  app: {
    name: "Welcome Book",
    tagline: "Everything you need, in one place",
  },
  nav: {
    back: "Back",
    home: "Home",
    language: "Language",
  },
  sections: {
    benvenuto: { label: "Welcome", hint: "A note from your host" },
    checkin: { label: "Check-in", hint: "How to get in" },
    regole: { label: "House rules", hint: "A few important things" },
    posizione: { label: "Location", hint: "Where we are" },
    trasporti: { label: "Transport", hint: "Getting around" },
    servizi: { label: "Services", hint: "Pharmacies, banks, essentials" },
    attivita: { label: "Things to do", hint: "What's around here" },
    ristoranti: { label: "Restaurants", hint: "Where to eat well" },
    bar: { label: "Cafés & bars", hint: "Breakfast and drinks" },
    shopping: { label: "Shopping", hint: "Supermarkets and shops" },
    informazioni: { label: "Info", hint: "Frequently asked questions" },
    video: { label: "Video guides", hint: "Short practical videos" },
    emergenza: { label: "Emergency", hint: "Useful numbers" },
    checkout: { label: "Check-out", hint: "Before you leave" },
    contatti: { label: "Contact", hint: "Message or call us" },
  },
  common: {
    call: "Call",
    directions: "Directions",
    website: "Website",
    copy: "Copy",
    copied: "Copied",
    hours: "Hours",
    recommended: "Recommended",
    empty: "Nothing here yet. Check back soon.",
    walkMinutes: (m) => `${m} min walk`,
    meters: (m) => `${m} m`,
    kilometers: (km) => `${km} km`,
    filterAll: "All",
    showMore: "Show all",
    showLess: "Show less",
  },
  checkin: {
    from: "Check-in from",
    videoTitle: "See how to get in",
  },
  checkout: {
    by: "Check-out by",
  },
  posizione: {
    address: "Address",
    openMaps: "Open in Google Maps",
  },
  contatti: {
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    hint: "We usually reply within an hour.",
  },
  emergenza: {
    generic: "European emergency number",
    hint: "In immediate danger call 112 — free from any phone.",
  },
  video: {
    play: "Play",
    watchOn: "Watch the video",
  },
};

export default en;
