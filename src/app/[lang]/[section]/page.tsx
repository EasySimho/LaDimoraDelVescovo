import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Accordion } from "@/components/Accordion";
import { ContactList } from "@/components/ContactList";
import { MapCard } from "@/components/MapCard";
import { PlaceList } from "@/components/PlaceList";
import { RichText } from "@/components/RichText";
import { RulesList } from "@/components/RulesList";
import { VideoFacade } from "@/components/VideoFacade";
import { WelcomeGallery } from "@/components/WelcomeGallery";
import { getDict, isLang, LANGS, pick, type Lang } from "@/lib/i18n";
import type { GuestBookData, Video } from "@/lib/schema";
import { getSection, SECTIONS, type Section } from "@/lib/sections";
import { getData } from "@/lib/sheet";

// Vedi la nota in `[lang]/page.tsx`: deve restare allineato a `lib/sheet.ts`.
export const revalidate = 600;

/** 5 lingue × 16 sezioni = 80 pagine statiche, generate in build. */
export function generateStaticParams() {
  return LANGS.flatMap((lang) => SECTIONS.map((section) => ({ lang, section: section.key })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}): Promise<Metadata> {
  const { lang, section } = await params;
  if (!isLang(lang) || !getSection(section)) return {};

  const dict = getDict(lang);
  const entry = dict.sections[section as keyof typeof dict.sections];
  return { title: entry.label, description: entry.hint };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section: sectionKey } = await params;
  const section = getSection(sectionKey);
  if (!isLang(lang) || !section) notFound();

  const typedLang = lang as Lang;
  const dict = getDict(typedLang);
  const data = await getData();
  const entry = dict.sections[section.key];

  return (
    <div className="pt-6">
      <header className="mb-5">
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight">
          {entry.label}
        </h1>
        <p className="mt-1 text-[0.9rem] text-fumo">{entry.hint}</p>
      </header>

      <Body section={section} lang={typedLang} data={data} />
    </div>
  );
}

function Body({
  section,
  lang,
  data,
}: {
  section: Section;
  lang: Lang;
  data: GuestBookData;
}) {
  const dict = getDict(lang);
  const { info } = data;

  switch (section.kind) {
    case "places": {
      const places = data.luoghi.filter((p) => p.sezione === section.key);
      const videos = data.video.filter((v) => v.sezione === section.key);
      const isEmpty = places.length === 0 && videos.length === 0;

      return (
        <div className="space-y-6">
          {section.key === "emergenza" && (
            <p className="rounded-xl border border-rosso/25 bg-rosso-tenue p-4 text-[0.88rem] leading-relaxed text-rosso-scuro">
              {dict.emergenza.hint}
            </p>
          )}
          {isEmpty ? (
            <Empty lang={lang} />
          ) : (
            <>
              {places.length > 0 && <PlaceList places={places} lang={lang} />}
              {videos.length > 0 && <VideoBlock videos={videos} lang={lang} />}
            </>
          )}
        </div>
      );
    }

    case "text": {
      const text = section.infoKey ? pick(info[section.infoKey] ?? {}, lang) : "";
      return (
        <div className="space-y-6">
          {text ? <RichText text={text} /> : <Empty lang={lang} />}
          {section.key === "benvenuto" && <WelcomeGallery />}
        </div>
      );
    }

    case "rules":
      return data.regole.length > 0 ? (
        <RulesList rules={data.regole} lang={lang} />
      ) : (
        <Empty lang={lang} />
      );

    case "checkin":
      return (
        <div className="space-y-6">
          <TimeBadge label={dict.checkin.from} value={pick(info.checkin_orario ?? {}, lang)} />
          <RichText text={pick(info.checkin_testo ?? {}, lang)} />
          <VideoBlock videos={data.video.filter((v) => v.sezione === "checkin")} lang={lang} />
        </div>
      );

    case "checkout":
      return (
        <div className="space-y-6">
          <TimeBadge label={dict.checkout.by} value={pick(info.checkout_orario ?? {}, lang)} />
          <RichText text={pick(info.checkout_testo ?? {}, lang)} />
        </div>
      );

    case "map":
      return (
        <MapCard
          lang={lang}
          address={pick(info.indirizzo_casa ?? {}, lang)}
          lat={toCoord(info.coord_lat)}
          lng={toCoord(info.coord_lng)}
        />
      );

    case "faq": {
      const items = data.faq
        .map((f, index) => ({
          id: f.id ?? String(index),
          question: pick(f.domanda, lang),
          answer: pick(f.risposta, lang),
        }))
        .filter((f) => f.question && f.answer);

      return items.length > 0 ? <Accordion items={items} /> : <Empty lang={lang} />;
    }

    case "videos":
      return data.video.length > 0 ? (
        <VideoBlock videos={data.video} lang={lang} />
      ) : (
        <Empty lang={lang} />
      );

    case "contacts":
      return (
        <ContactList
          lang={lang}
          phone={pick(info.telefono_host ?? {}, lang)}
          whatsapp={pick(info.whatsapp_host ?? {}, lang)}
          email={pick(info.email_host ?? {}, lang)}
        />
      );
  }
}

function VideoBlock({ videos, lang }: { videos: Video[]; lang: Lang }) {
  if (videos.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map((video, index) => (
        <VideoFacade
          key={video.id ?? `${video.video_id}-${index}`}
          video={video}
          title={pick(video.titolo, lang)}
        />
      ))}
    </ul>
  );
}

function TimeBadge({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="inline-flex items-baseline gap-2 rounded-full bg-rosso-tenue px-4 py-2">
      <span className="text-[0.8rem] font-medium text-rosso-scuro">{label}</span>
      <span className="font-display text-lg font-semibold tabular-nums text-rosso">{value}</span>
    </p>
  );
}

function Empty({ lang }: { lang: Lang }) {
  return <p className="card p-4 text-sm text-fumo">{getDict(lang).common.empty}</p>;
}

/** Le coordinate stanno in `info` come testo: qui diventano numeri o niente. */
function toCoord(cell: Record<string, string | undefined> | undefined): number | undefined {
  const raw = cell?.it ?? Object.values(cell ?? {})[0];
  if (!raw) return undefined;
  const n = Number(raw.trim().replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}
