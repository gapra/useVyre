/**
 * useVyre eval scorer.
 *
 * Measures, deterministically, how much useVyre's AI context reduces UI
 * hallucinations. For every fixture it RE-MEASURES the code with useVyre's
 * own tooling — it never trusts the with-/without-context folder label. That
 * dogfooding is the point: the number is produced by the same validator
 * useVyre ships to users, so it's reproducible and not cherry-picked.
 *
 * Two detectors, mapping to concrete README claims:
 *   1. validate-ai-context  → hallucinated props + invalid enum/variant values
 *   2. raw-color regex       → "AI uses raw color values" (hex / rgb()/hsl())
 *
 * Not LLM-driven by design: a fixed corpus gives a stable, CI-able number.
 * Swap richer corpora in without touching the scorer.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSource } from "../packages/validate-ai-context/src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = resolve(__dirname, "fixtures");

// Hex (#abc / #aabbcc) or rgb()/rgba()/hsl() literals in JSX/style — the
// thing semantic tokens are meant to replace. Token vars (var(--vyre-…))
// never match, so correct useVyre code scores zero here.
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/g;

function scoreFile(code) {
  const propIssues = validateSource(code, "<eval>").flatMap((r) => r.issues);
  const rawColors = [...code.matchAll(RAW_COLOR)].map((m) => m[0]);
  return {
    hallucinatedProps: propIssues.filter((i) => i.type === "hallucinated-prop")
      .length,
    invalidEnums: propIssues.filter((i) => i.type === "invalid-enum-value")
      .length,
    rawColors: rawColors.length,
    get total() {
      return this.hallucinatedProps + this.invalidEnums + this.rawColors;
    },
    details: {
      props: propIssues.map((i) => `${i.prop}: ${i.message}`),
      colors: rawColors,
    },
  };
}

function scoreArm(arm) {
  const dir = resolve(FIXTURES, `${arm}-context`);
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
  const perFile = {};
  let halluc = 0,
    enums = 0,
    colors = 0,
    cleanFiles = 0;

  for (const f of files) {
    const s = scoreFile(readFileSync(resolve(dir, f), "utf8"));
    perFile[f] = s;
    halluc += s.hallucinatedProps;
    enums += s.invalidEnums;
    colors += s.rawColors;
    if (s.total === 0) cleanFiles++;
  }

  return {
    arm,
    files: files.length,
    cleanFiles,
    hallucinatedProps: halluc,
    invalidEnums: enums,
    rawColors: colors,
    totalIssues: halluc + enums + colors,
    cleanRate: files.length ? cleanFiles / files.length : 0,
    perFile,
  };
}

export function runEval() {
  const without = scoreArm("without");
  const with_ = scoreArm("with");

  const reduction =
    without.totalIssues === 0
      ? 0
      : (without.totalIssues - with_.totalIssues) / without.totalIssues;

  return { without, with: with_, reduction };
}

// Allow `node eval/scorer.js` for ad-hoc runs; report.js is the pretty entry.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(runEval(), null, 2));
}
