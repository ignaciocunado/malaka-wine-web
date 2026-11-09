import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { AgeGate } from "@/components/site/age-gate";
import { Footer } from "@/components/site/footer";
import { NavBar } from "@/components/site/nav-bar";

import "./globals.css";

// Apple devices render the system font (SF Pro); Inter is the closest fallback everywhere else.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Display serif for headlines and the bottle labels. The optical-size axis keeps it fine at large sizes and sturdy
// at small ones.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  title: {
    default: "Malaka Wine — Vino de Málaga, cada mes en tu casa",
    template: "%s · Malaka",
  },
  description: "Una caja al mes con los vinos de las pequeñas bodegas de Málaga, elegidos según tus gustos.",
  openGraph: {
    title: "Malaka — Vino de Málaga, cada mes en tu casa",
    description: "Una caja al mes con los vinos de las pequeñas bodegas de Málaga, elegidos según tus gustos.",
    siteName: "Malaka",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AgeGate />
      </body>
    </html>
  );
}
