/**
 * An FAQ answer is a list of blocks: a string is a paragraph, `{ list }` is a bulleted list. Text may wrap a phrase
 * in `**double asterisks**` to set it in bold.
 */
export type FaqBlock = string | { list: string[] };
export type FaqQuestion = { q: string; a: FaqBlock[] };

/** Markdown's backslash escapes (`\*`, `\.`, …) stand for the character itself. */
const unescape = (text: string) => text.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, "$1");

/**
 * An answer as the CMS saves it, in Markdown: paragraphs separated by blank lines, and lists whose lines start with
 * `- ` or `* `. Bold stays as `**…**` for the FAQ to render.
 */
export function faqBlocks(markdown: string): FaqBlock[] {
  return markdown.split(/\n\s*\n/).map((block) => {
    const lines = block.trim().split("\n").map((line) => line.trim());
    return lines.every((line) => /^[-*] /.test(line))
      ? { list: lines.map((line) => unescape(line.slice(2))) }
      : unescape(lines.join(" "));
  });
}

const stripBold = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1");

/** An answer as plain text, for structured data: paragraphs and list items each on their own line. */
export function faqAnswerText(blocks: FaqBlock[]): string {
  return blocks.map((block) => (typeof block === "string" ? stripBold(block) : block.list.map(stripBold).join("\n"))).join("\n");
}
