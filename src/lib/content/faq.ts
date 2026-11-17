/**
 * An FAQ answer is a list of blocks: a string is a paragraph, `{ list }` is a bulleted list. Text may wrap a phrase
 * in `**double asterisks**` to set it in bold.
 */
export type FaqBlock = string | { list: string[] };
export type FaqQuestion = { q: string; a: FaqBlock[] };

const stripBold = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1");

/** An answer as plain text, for structured data: paragraphs and list items each on their own line. */
export function faqAnswerText(blocks: FaqBlock[]): string {
  return blocks.map((block) => (typeof block === "string" ? stripBold(block) : block.list.map(stripBold).join("\n"))).join("\n");
}
