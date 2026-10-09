import localFont from "next/font/local";

/*
  Self-hosted variable fonts (SIL Open Font License, see src/fonts/).
  next/font sizes a matching fallback, so the page doesn't jump when the
  real fonts arrive. The two fonts used above the fold are preloaded; the
  italic (only used in the reviews further down) loads when needed.
*/

export const serifFont = localFont({
  src: "../fonts/fraunces-latin-opsz-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-serif-face",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const serifItalicFont = localFont({
  src: "../fonts/fraunces-latin-opsz-italic.woff2",
  weight: "100 900",
  style: "italic",
  variable: "--font-serif-italic-face",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const sansFont = localFont({
  src: "../fonts/dm-sans-latin-opsz-normal.woff2",
  weight: "100 1000",
  variable: "--font-sans-face",
  display: "swap",
  adjustFontFallback: "Arial",
});
