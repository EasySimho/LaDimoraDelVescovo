import {
  Bus,
  CircleAlert,
  Coffee,
  Compass,
  Info,
  KeyRound,
  LifeBuoy,
  LogOut,
  MapPin,
  Phone,
  PlayCircle,
  ScrollText,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Ogni sezione dichiara un `kind`: la pagina `[section]` è una sola e sceglie il
 * renderer in base a questo campo, invece di avere 16 file quasi identici.
 */
export type SectionKind =
  | "places"
  | "text"
  | "rules"
  | "checkin"
  | "checkout"
  | "map"
  | "faq"
  | "videos"
  | "contacts";

export type SectionKey =
  | "benvenuto"
  | "checkin"
  | "regole"
  | "posizione"
  | "trasporti"
  | "servizi"
  | "attivita"
  | "ristoranti"
  | "bar"
  | "shopping"
  | "informazioni"
  | "video"
  | "emergenza"
  | "checkout"
  | "contatti";

export type Section = {
  key: SectionKey;
  kind: SectionKind;
  icon: LucideIcon;
  /** Solo per kind `text`: quale riga di `info` mostrare. */
  infoKey?: string;
};

/** L'ordine di questo array è l'ordine della griglia in home. */
export const SECTIONS: Section[] = [
  { key: "benvenuto", kind: "text", icon: Sparkles, infoKey: "benvenuto_testo" },
  { key: "checkin", kind: "checkin", icon: KeyRound },
  { key: "regole", kind: "rules", icon: ScrollText },
  { key: "posizione", kind: "map", icon: MapPin },
  { key: "trasporti", kind: "places", icon: Bus },
  { key: "servizi", kind: "places", icon: LifeBuoy },
  { key: "attivita", kind: "places", icon: Compass },
  { key: "ristoranti", kind: "places", icon: UtensilsCrossed },
  { key: "bar", kind: "places", icon: Coffee },
  { key: "shopping", kind: "places", icon: ShoppingBag },
  { key: "informazioni", kind: "faq", icon: Info },
  { key: "video", kind: "videos", icon: PlayCircle },
  { key: "emergenza", kind: "places", icon: CircleAlert },
  { key: "checkout", kind: "checkout", icon: LogOut },
  { key: "contatti", kind: "contacts", icon: Phone },
];

export const SECTION_KEYS = SECTIONS.map((s) => s.key);

export function getSection(key: string): Section | undefined {
  return SECTIONS.find((s) => s.key === key);
}
