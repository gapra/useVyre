import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = resolve(root, "src");
const dist = resolve(root, "dist");

mkdirSync(dist, { recursive: true });

const full = readFileSync(resolve(src, "full-context.md"), "utf8");

// full-context.md — used as-is
writeFileSync(resolve(dist, "full-context.md"), full);

// cursor-rules.md — .cursor/rules format
writeFileSync(resolve(dist, "cursor-rules.md"), [
  "---",
  "description: useVyre design system rules — follow these when writing UI code",
  "alwaysApply: true",
  "---",
  "",
  full,
].join("\n"));

// claude-context.md — CLAUDE.md / system prompt format
writeFileSync(resolve(dist, "claude-context.md"), [
  "# useVyre Design System Context",
  "",
  "You are working in a codebase that uses the useVyre design system.",
  "Follow the rules below strictly when writing any UI code.",
  "",
  full,
].join("\n"));

// windsurf-rules.md — .windsurf/rules format
writeFileSync(resolve(dist, "windsurf-rules.md"), [
  "# useVyre Rules for Windsurf",
  "",
  full,
].join("\n"));

// copilot-instructions.md — .github/copilot-instructions.md format
writeFileSync(resolve(dist, "copilot-instructions.md"), [
  "# useVyre Copilot Instructions",
  "",
  "When generating UI code in this project, follow the useVyre design system rules below.",
  "",
  full,
].join("\n"));

// index.js — JS entry that exports the context strings
const escape = (s) => s.replace(/`/g, "\\`").replace(/\$/g, "\\$");

writeFileSync(resolve(dist, "index.js"), [
  `export const fullContext = \`${escape(full)}\`;`,
  `export const cursorRules = \`${escape(readFileSync(resolve(dist, "cursor-rules.md"), "utf8"))}\`;`,
  `export const claudeContext = \`${escape(readFileSync(resolve(dist, "claude-context.md"), "utf8"))}\`;`,
  `export const windsurfRules = \`${escape(readFileSync(resolve(dist, "windsurf-rules.md"), "utf8"))}\`;`,
  `export const copilotInstructions = \`${escape(readFileSync(resolve(dist, "copilot-instructions.md"), "utf8"))}\`;`,
  "",
].join("\n"));

console.log("@usevyre/ai-context built successfully");
