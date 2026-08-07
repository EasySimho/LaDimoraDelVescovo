import type { MetadataRoute } from "next";

/**
 * "Aggiungi a Home" trasforma la webapp in un'icona sul telefono dell'ospite:
 * il QR si inquadra una volta sola, poi il libro di benvenuto è a portata di
 * pollice per tutto il soggiorno.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Libro di Benvenuto",
    short_name: "Benvenuto",
    description: "Tutto quello che ti serve durante il soggiorno, in un posto solo.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf6ef",
    theme_color: "#faf6ef",
    lang: "it",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
