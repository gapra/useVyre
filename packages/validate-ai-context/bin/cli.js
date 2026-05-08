#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, extname, relative } from "path";
import { validateSource, formatResults } from "../src/validator.js";

// ── Arg parsing ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
@usevyre/validate-ai-context

Scans JSX/TSX files for invalid useVyre component usage (AI hallucinations).

USAGE
  npx @usevyre/validate-ai-context [paths...] [options]

ARGUMENTS
  paths       Files or directories to scan (default: src/)

OPTIONS
  --ext       File extensions to scan (default: tsx,jsx,ts,js)
  --quiet     Only show errors, not warnings
  --json      Output results as JSON
  --help, -h  Show this help

EXAMPLES
  npx @usevyre/validate-ai-context
  npx @usevyre/validate-ai-context src/components
  npx @usevyre/validate-ai-context src/pages/dashboard.tsx
  npx @usevyre/validate-ai-context --quiet
`);
  process.exit(0);
}

const quietFlag = args.includes("--quiet");
const jsonFlag = args.includes("--json");
const extArg = args.find(a => a.startsWith("--ext="));
const extensions = extArg
  ? extArg.replace("--ext=", "").split(",").map(e => `.${e.trim()}`)
  : [".tsx", ".jsx", ".ts", ".js"];

const inputPaths = args.filter(a => !a.startsWith("--") && a !== "--quiet" && a !== "--json");
const targetPaths = inputPaths.length > 0 ? inputPaths.map(p => resolve(p)) : [resolve("src")];

// ── File collection ───────────────────────────────────────────────────────────

function collectFiles(target) {
  const files = [];
  try {
    const stat = statSync(target);
    if (stat.isFile()) {
      if (extensions.includes(extname(target))) files.push(target);
    } else if (stat.isDirectory()) {
      for (const entry of readdirSync(target)) {
        files.push(...collectFiles(resolve(target, entry)));
      }
    }
  } catch {
    // skip unreadable paths
  }
  return files;
}

const files = targetPaths.flatMap(collectFiles);

if (files.length === 0) {
  console.error("No files found to validate.");
  process.exit(1);
}

// ── Validate ──────────────────────────────────────────────────────────────────

const allResults = [];

for (const file of files) {
  const code = readFileSync(file, "utf8");
  const rel = relative(process.cwd(), file);
  const results = validateSource(code, rel);
  allResults.push(...results);
}

// ── Output ────────────────────────────────────────────────────────────────────

if (jsonFlag) {
  console.log(JSON.stringify(allResults, null, 2));
  const errorCount = allResults.flatMap(r => r.issues).filter(i => i.severity === "error").length;
  process.exit(errorCount > 0 ? 1 : 0);
}

const filteredResults = quietFlag
  ? allResults.map(r => ({ ...r, issues: r.issues.filter(i => i.severity === "error") })).filter(r => r.issues.length > 0)
  : allResults;

const { output, errorCount, warningCount } = formatResults(filteredResults);

const scanned = `Scanned ${files.length} file${files.length === 1 ? "" : "s"}`;

if (errorCount === 0 && warningCount === 0) {
  console.log(`✅ ${scanned} — no issues found.`);
  process.exit(0);
}

if (output) console.log(output);

const summary = [
  scanned,
  errorCount > 0 ? `${errorCount} error${errorCount === 1 ? "" : "s"}` : null,
  warningCount > 0 && !quietFlag ? `${warningCount} warning${warningCount === 1 ? "" : "s"}` : null,
].filter(Boolean).join(" · ");

console.log(summary);
process.exit(errorCount > 0 ? 1 : 0);
