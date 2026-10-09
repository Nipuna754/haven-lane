import type { Metadata } from "next";
import { sansFont, serifFont, serifItalicFont } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "Haven Lane Realty: homes for sale and rent in Austin",
    template: "%s | Haven Lane Realty",
  },
  description:
    "Find homes for sale and rent across Austin with local agents who live where they sell. A fictional agency for a portfolio project.",
};

/* The site pages add their menu and footer in (site)/layout.tsx; /studio has neither. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serifFont.variable} ${serifItalicFont.variable} ${sansFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
