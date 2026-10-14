import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { NavBar } from "@/components/site/nav-bar";

import "./globals.css";

// Apple devices render the system font (SF Pro); Inter is the closest fallback everywhere else.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Terruño — Vino de Málaga, cada mes en tu casa",
    template: "%s · Terruño",
  },
  description: "Una caja al mes con los vinos de las pequeñas bodegas de Málaga, elegidos según tus gustos.",
  openGraph: {
    title: "Terruño — Vino de Málaga, cada mes en tu casa",
    description: "Una caja al mes con los vinos de las pequeñas bodegas de Málaga, elegidos según tus gustos.",
    siteName: "Terruño",
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
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
