import type { Lang } from "@/lib/i18n";

/**
 * Categorie dei luoghi. Nel Google Sheet si scrive **solo la chiave**
 * (es. `supermercato`) e la traduzione la mette l'app: l'host non traduce nulla.
 * Se nel foglio compare una chiave sconosciuta, viene mostrata così com'è
 * (vedi `categoryLabel`) — meglio un'etichetta grezza che una riga scartata.
 */
export const CATEGORIES = {
  // spesa
  supermercato: { it: "Supermercato", en: "Supermarket", fr: "Supermarché", es: "Supermercado", de: "Supermarkt" },
  alimentari: { it: "Alimentari", en: "Grocery", fr: "Épicerie", es: "Ultramarinos", de: "Lebensmittel" },
  panetteria: { it: "Panetteria", en: "Bakery", fr: "Boulangerie", es: "Panadería", de: "Bäckerei" },
  macelleria: { it: "Macelleria", en: "Butcher", fr: "Boucherie", es: "Carnicería", de: "Metzgerei" },
  mercato: { it: "Mercato", en: "Market", fr: "Marché", es: "Mercado", de: "Markt" },
  tabaccheria: { it: "Tabaccheria", en: "Tobacconist", fr: "Tabac", es: "Estanco", de: "Tabakladen" },
  edicola: { it: "Edicola", en: "Newsstand", fr: "Kiosque", es: "Quiosco", de: "Kiosk" },

  // mangiare e bere
  ristorante: { it: "Ristorante", en: "Restaurant", fr: "Restaurant", es: "Restaurante", de: "Restaurant" },
  trattoria: { it: "Trattoria", en: "Trattoria", fr: "Trattoria", es: "Trattoria", de: "Trattoria" },
  pizzeria: { it: "Pizzeria", en: "Pizzeria", fr: "Pizzeria", es: "Pizzería", de: "Pizzeria" },
  sushi: { it: "Sushi", en: "Sushi", fr: "Sushi", es: "Sushi", de: "Sushi" },
  gelateria: { it: "Gelateria", en: "Ice cream", fr: "Glacier", es: "Heladería", de: "Eisdiele" },
  pasticceria: { it: "Pasticceria", en: "Pastry shop", fr: "Pâtisserie", es: "Pastelería", de: "Konditorei" },
  caffe: { it: "Caffè", en: "Café", fr: "Café", es: "Cafetería", de: "Café" },
  bar: { it: "Bar", en: "Bar", fr: "Bar", es: "Bar", de: "Bar" },
  pub: { it: "Pub", en: "Pub", fr: "Pub", es: "Pub", de: "Pub" },
  enoteca: { it: "Enoteca", en: "Wine bar", fr: "Bar à vin", es: "Vinoteca", de: "Weinbar" },

  // servizi
  farmacia: { it: "Farmacia", en: "Pharmacy", fr: "Pharmacie", es: "Farmacia", de: "Apotheke" },
  ospedale: { it: "Ospedale", en: "Hospital", fr: "Hôpital", es: "Hospital", de: "Krankenhaus" },
  medico: { it: "Medico", en: "Doctor", fr: "Médecin", es: "Médico", de: "Arzt" },
  veterinario: { it: "Veterinario", en: "Vet", fr: "Vétérinaire", es: "Veterinario", de: "Tierarzt" },
  banca: { it: "Banca", en: "Bank", fr: "Banque", es: "Banco", de: "Bank" },
  bancomat: { it: "Bancomat", en: "ATM", fr: "Distributeur", es: "Cajero", de: "Geldautomat" },
  posta: { it: "Posta", en: "Post office", fr: "Poste", es: "Correos", de: "Post" },
  lavanderia: { it: "Lavanderia", en: "Laundry", fr: "Laverie", es: "Lavandería", de: "Wäscherei" },
  benzina: { it: "Benzinaio", en: "Petrol station", fr: "Station-service", es: "Gasolinera", de: "Tankstelle" },

  // trasporti
  parcheggio: { it: "Parcheggio", en: "Parking", fr: "Parking", es: "Aparcamiento", de: "Parkplatz" },
  autobus: { it: "Autobus", en: "Bus", fr: "Bus", es: "Autobús", de: "Bus" },
  treno: { it: "Treno", en: "Train", fr: "Train", es: "Tren", de: "Zug" },
  taxi: { it: "Taxi", en: "Taxi", fr: "Taxi", es: "Taxi", de: "Taxi" },
  noleggio: { it: "Noleggio", en: "Rental", fr: "Location", es: "Alquiler", de: "Verleih" },
  aeroporto: { it: "Aeroporto", en: "Airport", fr: "Aéroport", es: "Aeropuerto", de: "Flughafen" },

  // cosa fare
  museo: { it: "Museo", en: "Museum", fr: "Musée", es: "Museo", de: "Museum" },
  chiesa: { it: "Chiesa", en: "Church", fr: "Église", es: "Iglesia", de: "Kirche" },
  parco: { it: "Parco", en: "Park", fr: "Parc", es: "Parque", de: "Park" },
  spiaggia: { it: "Spiaggia", en: "Beach", fr: "Plage", es: "Playa", de: "Strand" },
  sentiero: { it: "Sentiero", en: "Trail", fr: "Sentier", es: "Sendero", de: "Wanderweg" },
  palestra: { it: "Palestra", en: "Gym", fr: "Salle de sport", es: "Gimnasio", de: "Fitnessstudio" },
  piscina: { it: "Piscina", en: "Pool", fr: "Piscine", es: "Piscina", de: "Schwimmbad" },
  panorama: { it: "Panorama", en: "Viewpoint", fr: "Point de vue", es: "Mirador", de: "Aussichtspunkt" },

  // negozi
  negozio: { it: "Negozio", en: "Shop", fr: "Boutique", es: "Tienda", de: "Geschäft" },
  abbigliamento: { it: "Abbigliamento", en: "Clothing", fr: "Vêtements", es: "Ropa", de: "Kleidung" },
  souvenir: { it: "Souvenir", en: "Souvenirs", fr: "Souvenirs", es: "Recuerdos", de: "Souvenirs" },

  // emergenze
  polizia: { it: "Polizia", en: "Police", fr: "Police", es: "Policía", de: "Polizei" },
  carabinieri: { it: "Carabinieri", en: "Carabinieri", fr: "Carabiniers", es: "Carabinieri", de: "Carabinieri" },
  pompieri: { it: "Vigili del fuoco", en: "Fire brigade", fr: "Pompiers", es: "Bomberos", de: "Feuerwehr" },
  emergenza: { it: "Emergenze", en: "Emergency", fr: "Urgences", es: "Emergencias", de: "Notruf" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

/** Traduce una categoria; se la chiave non esiste restituisce il testo grezzo. */
export function categoryLabel(key: string, lang: Lang): string {
  const entry = CATEGORIES[key as CategoryKey];
  return entry ? entry[lang] : key;
}
