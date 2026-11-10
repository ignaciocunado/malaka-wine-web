import { Fraunces, Inter } from "next/font/google";

// Apple devices render the system font (SF Pro); Inter is the closest fallback everywhere else.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Display serif for headlines and the bottle labels. The optical-size axis keeps it fine at large sizes and sturdy
// at small ones.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

/** Class names that define the font CSS variables; they go on `<html>`. */
export const fontVariables = `${inter.variable} ${fraunces.variable}`;
