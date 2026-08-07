import { Fragment } from "react";

/**
 * I testi lunghi (benvenuto, check-in, check-out) arrivano da una cella del
 * foglio, dove l'host scrive normalmente. Invece di tirarci dentro una libreria
 * markdown, supportiamo le tre sole cose che serve davvero poter fare in una
 * cella: paragrafi, elenchi puntati con "- " e **grassetto**.
 */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  if (!text.trim()) return null;

  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className={`space-y-3 leading-relaxed text-inchiostro/90 ${className}`}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-•*]\s+/.test(l));

        if (isList) {
          return (
            <ul key={index} className="space-y-2 pl-1">
              {lines.map((line, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-rosso" />
                  <span>{bold(line.replace(/^[-•*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{bold(block)}</p>;
      })}
    </div>
  );
}

/** Spezza su **…** e rende in grassetto rosso: nei testi è sempre un codice o un orario. */
function bold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-rosso">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
