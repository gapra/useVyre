/**
 * @vyre/tokens build script
 * Transforms tokens.json → CSS variables + JS/TS exports
 * Zero dependencies — runs with plain Node.js
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");
const SRC  = resolve(ROOT, "src/tokens.json");
const DIST = resolve(ROOT, "dist");

mkdirSync(DIST, { recursive: true });

const raw = JSON.parse(readFileSync(SRC, "utf-8"));

// ── Helpers ──────────────────────────────────────────────────
/** Resolve alias references like {color.primitive.neutral.950} */
function resolveAlias(value, tokens) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const path = match[1].split(".");
  let node = tokens;
  for (const key of path) {
    node = node?.[key];
  }
  return node?.["$value"] ?? value;
}

/** Flatten token tree into [cssVarName, value, description] pairs */
function flattenTokens(node, prefix = "--vyre", tokens = raw) {
  const entries = [];
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const name = `${prefix}-${key}`;
    if (val && typeof val === "object" && "$value" in val) {
      const resolved = resolveAlias(val.$value, tokens);
      entries.push([name, resolved, val.$description ?? ""]);
    } else if (val && typeof val === "object") {
      entries.push(...flattenTokens(val, name, tokens));
    }
  }
  return entries;
}

/**
 * Flatten semantic light/dark tokens and map them to shared --vyre-color-semantic-*
 * variable names (stripping "-light" / "-dark" segment).
 */
function flattenSemanticTheme(node, tokens = raw) {
  const entries = [];
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const name = `--vyre-color-semantic-${key}`;
    if (val && typeof val === "object" && "$value" in val) {
      const resolved = resolveAlias(val.$value, tokens);
      entries.push([name, resolved, val.$description ?? ""]);
    } else if (val && typeof val === "object") {
      // nested (shouldn't exist in semantic, but guard)
      for (const [subKey, subVal] of Object.entries(val)) {
        if (subKey.startsWith("$")) continue;
        if (subVal && "$value" in subVal) {
          entries.push([
            `--vyre-color-semantic-${key}-${subKey}`,
            resolveAlias(subVal.$value, tokens),
            subVal.$description ?? "",
          ]);
        }
      }
    }
  }
  return entries;
}

function formatVars(entries, indent = "  ") {
  return entries
    .map(([name, value, desc]) => {
      const comment = desc ? `${indent}/* ${desc} */\n` : "";
      return `${comment}${indent}${name}: ${value};`;
    })
    .join("\n");
}

// ── 1. Generate CSS ───────────────────────────────────────────
function buildCSS() {
  // Tokens that are NOT semantic-light / semantic-dark (primitives, spacing, etc.)
  const baseEntries = flattenTokens({
    "color-primitive": raw.color.primitive,
    typography:        raw.typography,
    spacing:           raw.spacing,
    "border-radius":   raw["border-radius"],
    shadow:            raw.shadow,
    transition:        raw.transition,
    "z-index":         raw["z-index"],
  });

  const lightEntries = flattenSemanticTheme(raw.color["semantic-light"]);
  const darkEntries  = flattenSemanticTheme(raw.color["semantic-dark"]);

  return `/* ============================================================
   useVyre Design Tokens — v${getVersion()}
   Generated from tokens.json — DO NOT EDIT MANUALLY

   AI USAGE:
   - Import: @import "@vyre/tokens/css";
   - Use semantic tokens as: var(--vyre-color-semantic-[name])
   - Never use primitive tokens (--vyre-color-primitive-*) directly
   - Tokens adapt to light/dark theme automatically via [data-theme]
   - Full token list: https://usevyre.com/docs/tokens
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500&display=swap');

/* ── Base tokens (theme-independent) ── */
:root {
${formatVars(baseEntries)}
}

/* ── Light theme (default) ── */
:root,
[data-theme="light"] {
${formatVars(lightEntries)}
}

/* ── Dark theme ── */
[data-theme="dark"] {
${formatVars(darkEntries)}
}

/* ── System preference (no explicit data-theme) ── */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
${formatVars(darkEntries, "    ")}
  }
}
`;
}

// ── 2. Generate JS ────────────────────────────────────────────
function buildJS() {
  const allEntries = [
    ...flattenTokens({
      "color-primitive": raw.color.primitive,
      typography:        raw.typography,
      spacing:           raw.spacing,
      "border-radius":   raw["border-radius"],
      shadow:            raw.shadow,
      transition:        raw.transition,
      "z-index":         raw["z-index"],
    }),
    ...flattenSemanticTheme(raw.color["semantic-light"]).map(
      ([name, value, desc]) => [name, value, desc]
    ),
  ];

  const obj = allEntries
    .map(([name, value]) => {
      const jsKey = name
        .replace("--vyre-", "")
        .replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      return `  /** CSS: ${name} */\n  "${jsKey}": "${value}"`;
    })
    .join(",\n");

  return `/* useVyre Design Tokens — JS export */
/* Generated from tokens.json — DO NOT EDIT MANUALLY */

export const tokens = {
${obj}
};

export const cssVar = (token) => \`var(--vyre-\${token})\`;
`;
}

// ── 3. Generate TS declarations ───────────────────────────────
function buildDTS() {
  const allEntries = [
    ...flattenTokens({
      "color-primitive": raw.color.primitive,
      typography:        raw.typography,
      spacing:           raw.spacing,
      "border-radius":   raw["border-radius"],
      shadow:            raw.shadow,
      transition:        raw.transition,
      "z-index":         raw["z-index"],
    }),
    ...flattenSemanticTheme(raw.color["semantic-light"]),
  ];

  const keys = allEntries
    .map(([name]) => `  /** CSS: ${name} */\n  "${name.replace("--vyre-", "")}": string;`)
    .join("\n");

  return `/* useVyre Design Tokens — TypeScript declarations */
/* Generated from tokens.json — DO NOT EDIT MANUALLY */

export declare const tokens: {
${keys}
};

export declare function cssVar(token: string): string;
`;
}

// ── 4. Generate AI context (machine-readable) ─────────────────
function buildAIContext() {
  const lightEntries = flattenSemanticTheme(raw.color["semantic-light"]);
  const tokenList = lightEntries
    .map(([name, , desc]) => `${name}${desc ? ` — ${desc}` : ""}`)
    .join("\n");

  return `# useVyre Token Reference
# AI CONTEXT FILE — Include this in your system prompt or .cursor/rules
# Version: ${getVersion()}

## How to use useVyre tokens in component code:
- CSS: \`var(--vyre-color-semantic-accent)\`
- JS/TS: \`import { tokens } from "@vyre/tokens"\`

## Theme system:
- Default: light theme (:root)
- Dark theme: add data-theme="dark" to <html>
- Auto: if no data-theme set, follows prefers-color-scheme
- All semantic tokens adapt automatically — no manual theme branching needed

## Naming convention:
--vyre-[category]-[subcategory]-[variant]

## SEMANTIC COLOR TOKENS (use these in components):
${tokenList}

## Styling rules for AI:
1. NEVER use primitive tokens (--vyre-color-primitive-*) in components
2. ALWAYS use semantic tokens for color decisions
3. For interactive states: use -hover suffix tokens
4. For low-opacity backgrounds: use -subtle suffix tokens
5. Text hierarchy: text-primary > text-secondary > text-muted > text-disabled
6. For text on colored backgrounds: use text-inverse or accent-foreground

## Component variant API:
- data-variant="primary|secondary|ghost|accent|teal|danger"
- data-size="sm|md|lg|icon"
- data-state="error|success|warning"
`;
}

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    return pkg.version;
  } catch {
    return "0.0.0";
  }
}

// ── Run ───────────────────────────────────────────────────────
writeFileSync(resolve(DIST, "vyre.css"),      buildCSS());
writeFileSync(resolve(DIST, "tokens.js"),     buildJS());
writeFileSync(resolve(DIST, "tokens.d.ts"),   buildDTS());
writeFileSync(resolve(DIST, "tokens.json"),   readFileSync(SRC));
writeFileSync(resolve(DIST, "ai-context.md"), buildAIContext());

// index.js re-exports everything
writeFileSync(resolve(DIST, "index.js"),   `export * from "./tokens.js";\n`);
writeFileSync(resolve(DIST, "index.d.ts"), `export * from "./tokens.d.ts";\n`);

const lightCount = Object.keys(raw.color["semantic-light"]).filter(k => !k.startsWith("$")).length;
const darkCount  = Object.keys(raw.color["semantic-dark"]).filter(k => !k.startsWith("$")).length;

console.log(`✅ @vyre/tokens built — light: ${lightCount} semantic, dark: ${darkCount} semantic`);
console.log(`   dist/vyre.css      — CSS variables (light + dark theme)`);
console.log(`   dist/tokens.js     — JS/TS export`);
console.log(`   dist/tokens.json   — DTCG-compliant source`);
console.log(`   dist/ai-context.md — AI prompt context`);
