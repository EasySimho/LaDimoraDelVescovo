import { ImageResponse } from "next/og";

/**
 * iOS ignora il manifest per l'icona sulla home e vuole un PNG: lo generiamo in
 * build da questo componente, così non c'è un asset binario da tenere allineato
 * a mano quando la palette cambia. iOS arrotonda gli angoli da sé.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9B1B30",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 512 512" fill="none">
          <g
            stroke="#FAF6EF"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="196" cy="196" r="64" />
            <path d="M241 241 L360 360" />
            <path d="M316 316 L280 352" />
            <path d="M360 360 L324 396" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
