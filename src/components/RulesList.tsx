import {
  Ban,
  Baby,
  CigaretteOff,
  Dog,
  Flame,
  Key,
  Moon,
  PartyPopper,
  Recycle,
  Shirt,
  Sparkles,
  Trash2,
  Users,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import { pick, type Lang } from "@/lib/i18n";
import type { Rule } from "@/lib/schema";

/**
 * L'host scrive un nome nella colonna `icona`. Invece di importare tutte le
 * icone di lucide (centinaia di KB) accettiamo questo elenco curato e ripieghiamo
 * su un simbolo generico: un nome sbagliato nel foglio non deve rompere nulla.
 */
const ICONS: Record<string, LucideIcon> = {
  moon: Moon,
  silenzio: Moon,
  volume: Volume2,
  rumore: Volume2,
  "cigarette-off": CigaretteOff,
  fumo: CigaretteOff,
  users: Users,
  ospiti: Users,
  party: PartyPopper,
  feste: PartyPopper,
  dog: Dog,
  animali: Dog,
  baby: Baby,
  bambini: Baby,
  recycle: Recycle,
  raccolta: Recycle,
  trash: Trash2,
  rifiuti: Trash2,
  flame: Flame,
  fuoco: Flame,
  key: Key,
  chiavi: Key,
  shirt: Shirt,
  scarpe: Shirt,
  sparkles: Sparkles,
  pulizia: Sparkles,
};

export function RulesList({ rules, lang }: { rules: Rule[]; lang: Lang }) {
  return (
    <ul className="space-y-2.5">
      {rules.map((rule, index) => {
        const Icon = ICONS[rule.icona?.toLowerCase() ?? ""] ?? Ban;
        return (
          <li key={rule.id ?? index} className="card flex items-start gap-3.5 p-4">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-rosso-tenue text-rosso">
              <Icon size={17} strokeWidth={1.75} aria-hidden />
            </span>
            <p className="text-[0.92rem] leading-relaxed text-inchiostro/90">
              {pick(rule.testo, lang)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
