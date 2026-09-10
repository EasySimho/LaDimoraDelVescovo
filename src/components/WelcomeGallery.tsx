"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  {
    src: "/images/benvenuto/benvenuto-1.jpg",
    alt: "Zona giorno con cucina e dettagli d'arredo",
  },
  {
    src: "/images/benvenuto/benvenuto-2.jpg",
    alt: "Ingresso con accappatoi e lampada d'atmosfera",
  },
  {
    src: "/images/benvenuto/benvenuto-3.jpg",
    alt: "Terrazzo esterno con tavolo in legno e piante",
  },
  {
    src: "/images/benvenuto/benvenuto-4.jpg",
    alt: "Camera da letto matrimoniale con letto a baldacchino dorato",
  },
];

export function WelcomeGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % IMAGES.length));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === null ? 0 : (prev - 1 + IMAGES.length) % IMAGES.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);

  return (
    <div className="pt-2">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {IMAGES.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Ingrandisci immagine ${index + 1}`}
            className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-bordo/80 bg-panna-3 shadow-xs transition duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rosso"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Chiudi"
              className="absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
            >
              <X className="size-5" />
            </button>

            <div className="relative aspect-[16/10] w-[88vw] max-w-2xl">
              <Image
                src={IMAGES[selectedIndex].src}
                alt={IMAGES[selectedIndex].alt}
                fill
                sizes="(max-width: 768px) 90vw, 672px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
