import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { getDict, isLang, LANGS, LANG_META, type Lang } from "@/lib/i18n";
import { getData } from "@/lib/sheet";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

/** Le 5 lingue sono pregenerate: nessun rendering a runtime per la lingua. */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/** Qualsiasi altra lingua è un 404 secco, senza nemmeno provare a renderizzare. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};

  const dict = getDict(lang);
  const { info } = await getData();
  const name = info.casa_nome?.it ?? dict.app.name;

  return {
    title: { default: name, template: `%s · ${name}` },
    description: dict.app.tagline,
    // Nessun login e nessuna landing: la webapp si raggiunge solo dal QR in casa,
    // quindi la teniamo fuori dai motori di ricerca.
    robots: { index: false, follow: false },
    appleWebApp: { capable: true, statusBarStyle: "default", title: dict.app.name },
  };
}

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const typedLang = lang as Lang;

  return (
    <html
      lang={LANG_META[typedLang].locale}
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body>
        <Header lang={typedLang} />
        <main className="shell pb-16">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
