import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: false },
};

/**
 * L'unica root dell'app è `/[lang]`, quindi un URL con una lingua inesistente
 * (o una sezione sbagliata) cade fuori da ogni layout: questa pagina porta con
 * sé il proprio `<html>` e riporta l'ospite in home.
 */
export default function GlobalNotFound() {
  return (
    <html lang="it" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <main className="shell flex min-h-dvh flex-col items-center justify-center text-center">
          <p className="font-display text-5xl font-semibold text-rosso">404</p>
          <h1 className="mt-3 font-display text-xl font-semibold">Pagina non trovata</h1>
          <p className="mt-2 text-sm text-fumo">
            Il collegamento non esiste o è stato spostato.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-xl bg-rosso px-5 py-3 text-[0.92rem] font-semibold text-panna transition-colors active:bg-rosso-scuro"
          >
            Torna al libro di benvenuto
          </Link>
        </main>
      </body>
    </html>
  );
}
