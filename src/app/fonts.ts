import { Fraunces, Inter } from "next/font/google";

// Inter sets text and controls, as the design system asks.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Display serif for headlines and wine names, at 600 as the design system sets them. The optical-size axis keeps it
// fine at large sizes and sturdy at small ones.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

/** Class names that define the font CSS variables; they go on `<html>`. */
export const fontVariables = `${inter.variable} ${fraunces.variable}`;
