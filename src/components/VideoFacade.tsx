"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { Video } from "@/lib/schema";

/**
 * Finché l'ospite non tocca il video non carichiamo *niente* di YouTube o Vimeo:
 * solo la copertina come immagine. È la differenza tra una sezione che apre
 * istantaneamente e una che tira giù mezzo megabyte di player per ogni video in
 * lista. Al click sostituiamo la copertina con l'iframe già in riproduzione.
 */
export function VideoFacade({ video, title }: { video: Video; title: string }) {
  const [playing, setPlaying] = useState(false);

  const poster =
    video.piattaforma === "vimeo"
      ? `https://vumbnail.com/${video.video_id}.jpg`
      : `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`;

  const embed =
    video.piattaforma === "vimeo"
      ? `https://player.vimeo.com/video/${video.video_id}?autoplay=1&dnt=1`
      : `https://www.youtube-nocookie.com/embed/${video.video_id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <li className="card overflow-hidden">
      <div className="relative aspect-video bg-panna-3">
        {playing ? (
          <iframe
            src={embed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={title}
            className="group absolute inset-0 size-full"
          >
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover"
              unoptimized
            />
            <span className="absolute inset-0 bg-inchiostro/20 transition-colors group-active:bg-inchiostro/35" />
            <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-panna/95 shadow-lg transition-transform group-active:scale-95">
              <Play size={24} strokeWidth={2} className="ml-0.5 fill-rosso text-rosso" aria-hidden />
            </span>
            {video.durata && (
              <span className="absolute bottom-2 right-2 rounded bg-inchiostro/75 px-1.5 py-0.5 text-[0.7rem] font-medium tabular-nums text-panna">
                {video.durata}
              </span>
            )}
          </button>
        )}
      </div>

      <p className="px-4 py-3 font-display text-[0.95rem] font-semibold leading-snug tracking-tight">
        {title}
      </p>
    </li>
  );
}
