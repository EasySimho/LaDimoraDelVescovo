import type { Dict } from "./types";

const fr: Dict = {
  app: {
    name: "Livret d'accueil",
    tagline: "Tout ce qu'il vous faut, au même endroit",
  },
  nav: {
    back: "Retour",
    home: "Accueil",
    language: "Langue",
  },
  sections: {
    benvenuto: { label: "Bienvenue", hint: "Un mot de votre hôte" },
    checkin: { label: "Arrivée", hint: "Comment entrer" },
    regole: { label: "Règles", hint: "Quelques points importants" },
    posizione: { label: "Adresse", hint: "Où nous sommes" },
    trasporti: { label: "Transports", hint: "Se déplacer" },
    servizi: { label: "Services", hint: "Pharmacies, banques, essentiels" },
    attivita: { label: "Activités", hint: "Que faire dans les environs" },
    ristoranti: { label: "Restaurants", hint: "Où bien manger" },
    bar: { label: "Cafés & bars", hint: "Petit-déjeuner et apéritif" },
    shopping: { label: "Shopping", hint: "Supermarchés et boutiques" },
    informazioni: { label: "Infos", hint: "Questions fréquentes" },
    video: { label: "Vidéos", hint: "Courtes vidéos pratiques" },
    emergenza: { label: "Urgences", hint: "Numéros utiles" },
    checkout: { label: "Départ", hint: "Avant de partir" },
    contatti: { label: "Contact", hint: "Écrivez-nous ou appelez-nous" },
  },
  common: {
    call: "Appeler",
    directions: "Itinéraire",
    website: "Site web",
    copy: "Copier",
    copied: "Copié",
    hours: "Horaires",
    recommended: "Recommandé",
    empty: "Rien ici pour l'instant. Revenez bientôt.",
    walkMinutes: (m) => `${m} min à pied`,
    meters: (m) => `${m} m`,
    kilometers: (km) => `${km} km`,
    filterAll: "Tous",
    showMore: "Tout afficher",
    showLess: "Afficher moins",
  },
  checkin: {
    from: "Arrivée à partir de",
    videoTitle: "Voir comment entrer",
  },
  checkout: {
    by: "Départ avant",
  },
  posizione: {
    address: "Adresse",
    openMaps: "Ouvrir dans Google Maps",
  },
  contatti: {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "E-mail",
    hint: "Nous répondons généralement en moins d'une heure.",
  },
  emergenza: {
    generic: "Numéro d'urgence européen",
    hint: "En cas de danger immédiat, appelez le 112 — gratuit depuis n'importe quel téléphone.",
  },
  video: {
    play: "Lire",
    watchOn: "Voir la vidéo",
  },
};

export default fr;
