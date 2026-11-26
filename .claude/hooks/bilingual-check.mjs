// Claude Code hook that checks a change was made in both languages (see "Every change is bilingual" in CLAUDE.md).
//   node bilingual-check.mjs start   UserPromptSubmit: remembers the commit this turn starts from
//   node bilingual-check.mjs         Stop: checks what changed since then; exit 2 sends the problems back to Claude
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const lines = (text) => text.split("\n").filter(Boolean);

try {
  process.chdir(git("rev-parse", "--show-toplevel"));
} catch {
  process.exit(0); // not a git repository
}
const baseFile = git("rev-parse", "--git-path", "claude-turn-base");

if (process.argv[2] === "start") {
  // Print nothing: whatever a UserPromptSubmit hook prints is added to Claude's context.
  try {
    writeFileSync(baseFile, git("rev-parse", "HEAD"));
  } catch {
    // no commits yet
  }
  process.exit(0);
}

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  // no input
}
// Block at most once per turn: Claude has been told, and either fixed it or explained why.
if (input.stop_hook_active) process.exit(0);

let base = "HEAD";
try {
  const sha = readFileSync(baseFile, "utf8").trim();
  git("cat-file", "-e", `${sha}^{commit}`);
  base = sha;
} catch {
  // no turn recorded, or its commit is gone
}

const untracked = lines(git("ls-files", "--others", "--exclude-standard"));
const changed = new Set([...lines(git("diff", "--name-only", base)), ...untracked]);
if (changed.size === 0) process.exit(0);
const added = [...lines(git("diff", "--name-only", "--diff-filter=A", base)), ...untracked];

const problems = [];

// The site's text is in content/**/*.json, each file holding the Spanish under `es` and the English under `en`.
const readJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
for (const file of [...changed].filter((file) => file.startsWith("content/") && file.endsWith(".json") && existsSync(file))) {
  let before = null;
  try {
    before = readJson(git("show", `${base}:${file}`));
  } catch {
    // a new file
  }
  const after = readJson(readFileSync(file, "utf8"));
  if (!before || !after) continue;
  const esChanged = JSON.stringify(before.es) !== JSON.stringify(after.es);
  const enChanged = JSON.stringify(before.en) !== JSON.stringify(after.en);
  if (esChanged !== enChanged) {
    const [done, missing] = esChanged ? ["Spanish (es)", "English (en)"] : ["English (en)", "Spanish (es)"];
    problems.push(`${file}: the ${done} text changed but the ${missing} did not. Make the same change in the other language.`);
  }
}

const countPages = (dir) => readdirSync(dir, { recursive: true }).filter((file) => basename(file) === "page.tsx").length;
const esPages = countPages("src/app/(es)");
const enPages = countPages("src/app/en");
if (esPages !== enPages) {
  problems.push(
    `src/app/(es)/ has ${esPages} page.tsx files and src/app/en/ has ${enPages}. Every page needs a route file in both languages.`,
  );
}

const newPages = added.filter((file) => file.startsWith("src/app/") && file.endsWith("/page.tsx"));
const pageFiles = ["src/lib/site.ts", "src/app/sitemap.ts", "public/llms.txt"].filter((file) => !changed.has(file));
if (newPages.length > 0 && pageFiles.length > 0) {
  problems.push(
    `New page (${newPages.join(", ")}) but ${pageFiles.join(", ")} not updated. A new page needs its path in PATHS, a sitemap entry and a line in llms.txt.`,
  );
}

if ([...changed].some((file) => file.startsWith("src/")) && existsSync("node_modules")) {
  const result = spawnSync("npm", ["run", "typecheck"], { encoding: "utf8" });
  if (result.status !== 0) {
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim().split("\n").slice(-20).join("\n");
    problems.push(`npm run typecheck failed:\n${output}`);
  }
}

if (problems.length > 0) {
  console.error(
    [
      "Bilingual check (.claude/hooks/bilingual-check.mjs):",
      ...problems.map((problem) => `- ${problem}`),
      "If this change really applies to one language only, say so in your reply.",
    ].join("\n"),
  );
  process.exit(2);
}
