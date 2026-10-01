import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { NavBar } from "@/components/site/nav-bar";

import "./globals.css";

// Apple devices render the system font (SF Pro); Inter is the closest fallback everywhere else.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Terruño — Málaga wine & olive oil, delivered monthly",
    template: "%s · Terruño",
  },
  description:
    "A monthly box of wine and extra virgin olive oil from the small producers of Málaga, matched to your taste.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
