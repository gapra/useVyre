/**
 * @usevyre/tokens build script
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
   - Import: @import "@usevyre/tokens/css";
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
- JS/TS: \`import { tokens } from "@usevyre/tokens"\`

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

// ── 5. AI token usage hints (curated by semantic meaning) ────────────────────
const SEMANTIC_USAGE = {
  "background":            ["Page/app root background", "Layout wrapper background"],
  "surface":               ["Card background", "Panel background", "Sidebar background"],
  "surface-raised":        ["Dropdown background", "Popover background", "Elevated card background"],
  "surface-overlay":       ["Modal background", "Tooltip background", "Highest-elevation overlay"],
  "border":                ["Card border", "Input border", "Divider/Separator"],
  "border-subtle":         ["Section divider", "Low-contrast rule between rows"],
  "border-strong":         ["Input focus ring", "Selected item border", "Active tab underline"],
  "text-primary":          ["Heading text", "Body copy", "Button label (on neutral bg)"],
  "text-secondary":        ["Subtitle", "Description text", "Supporting label"],
  "text-muted":            ["Placeholder text", "Timestamp", "Helper hint", "Caption"],
  "text-disabled":         ["Disabled input text", "Greyed-out label"],
  "text-inverse":          ["Text on dark/accent background", "Text inside accent-colored badge"],
  "accent":                ["Button primary background", "Link active state", "Focus ring", "Badge accent variant", "Active nav indicator"],
  "accent-hover":          ["Button primary hover state"],
  "accent-foreground":     ["Text/icon on accent-colored background"],
  "accent-subtle":         ["Accent badge background", "Highlighted row background", "Chip background"],
  "accent-subtle-border":  ["Border of accent-subtle containers"],
  "teal":                  ["Button teal variant", "Code block accent", "AI-context indicator", "Badge teal variant"],
  "teal-hover":            ["Teal button hover state"],
  "teal-subtle":           ["Teal badge background"],
  "success":               ["Success alert icon/text", "Toast success border-left", "Badge success variant"],
  "success-subtle":        ["Success alert background", "Success badge background"],
  "success-subtle-border": ["Success alert border"],
  "warning":               ["Warning alert icon/text", "Toast warning border-left", "Badge warning variant", "Beta indicator"],
  "warning-subtle":        ["Warning alert background", "Warning badge background"],
  "warning-subtle-border": ["Warning alert border"],
  "danger":                ["Button danger variant", "Error alert icon/text", "Toast error border-left", "Badge danger variant", "Destructive action text"],
  "danger-hover":          ["Danger button hover state"],
  "danger-subtle":         ["Error alert background", "Danger badge background"],
  "danger-subtle-border":  ["Error alert border"],
};

const SEMANTIC_RELATED = {
  "accent":               ["accent-hover", "accent-foreground", "accent-subtle", "accent-subtle-border"],
  "accent-hover":         ["accent"],
  "accent-foreground":    ["accent", "accent-subtle"],
  "accent-subtle":        ["accent", "accent-subtle-border"],
  "accent-subtle-border": ["accent-subtle"],
  "teal":                 ["teal-hover", "teal-subtle"],
  "teal-hover":           ["teal"],
  "teal-subtle":          ["teal"],
  "success":              ["success-subtle", "success-subtle-border"],
  "success-subtle":       ["success", "success-subtle-border"],
  "success-subtle-border":["success", "success-subtle"],
  "warning":              ["warning-subtle", "warning-subtle-border"],
  "warning-subtle":       ["warning", "warning-subtle-border"],
  "warning-subtle-border":["warning", "warning-subtle"],
  "danger":               ["danger-hover", "danger-subtle", "danger-subtle-border"],
  "danger-hover":         ["danger"],
  "danger-subtle":        ["danger", "danger-subtle-border"],
  "danger-subtle-border": ["danger", "danger-subtle"],
  "text-primary":         ["text-secondary", "text-muted"],
  "text-secondary":       ["text-primary", "text-muted"],
  "text-muted":           ["text-secondary", "text-disabled"],
  "text-disabled":        ["text-muted"],
  "text-inverse":         ["accent-foreground"],
  "background":           ["surface"],
  "surface":              ["background", "surface-raised"],
  "surface-raised":       ["surface", "surface-overlay"],
  "surface-overlay":      ["surface-raised"],
  "border":               ["border-subtle", "border-strong"],
  "border-subtle":        ["border"],
  "border-strong":        ["border"],
};

// ── 6. Build ai-tokens.json ───────────────────────────────────
function buildAITokensJSON() {
  const version = getVersion();

  // Resolve raw alias references to their string values
  function resolve_(value, fallback = value) {
    if (typeof value !== "string") return String(value);
    const match = value.match(/^\{(.+)\}$/);
    if (!match) return value;
    const path = match[1].split(".");
    let node = raw;
    for (const k of path) node = node?.[k];
    return node?.["$value"] ?? fallback;
  }

  // Build semantic token entries (paired light/dark)
  const lightSemantic = raw.color["semantic-light"];
  const darkSemantic  = raw.color["semantic-dark"];

  const semanticTokens = Object.entries(lightSemantic)
    .filter(([k]) => !k.startsWith("$"))
    .map(([key, lightVal]) => {
      const darkVal   = darkSemantic[key];
      const cssVar    = `--vyre-color-semantic-${key}`;
      const jsKey     = `colorSemantic${key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase())}`;
      return {
        name:          `color.semantic.${key}`,
        cssVar,
        jsKey,
        category:      "color",
        subcategory:   "semantic",
        values: {
          light: resolve_(lightVal.$value, lightVal.$value),
          dark:  darkVal ? resolve_(darkVal.$value, darkVal.$value) : null,
        },
        aliases: {
          light: typeof lightVal.$value === "string" && lightVal.$value.startsWith("{")
            ? lightVal.$value.slice(1, -1) : null,
          dark: darkVal && typeof darkVal.$value === "string" && darkVal.$value.startsWith("{")
            ? darkVal.$value.slice(1, -1) : null,
        },
        description:   lightVal.$description ?? "",
        usage:         SEMANTIC_USAGE[key] ?? [],
        relatedTokens: (SEMANTIC_RELATED[key] ?? []).map(r => `color.semantic.${r}`),
        doNotUseDirectly: false,
      };
    });

  // Build non-semantic categories (spacing, typography, border-radius, shadow, transition, z-index)
  function buildCategory(node, prefix, category) {
    return flattenTokens(node, `--vyre-${prefix}`).map(([cssVar, value, desc]) => {
      const jsKey = cssVar.replace("--vyre-", "").replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      return { name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey, category, value: String(value), description: desc };
    });
  }

  const spacingTokens      = buildCategory(raw.spacing,          "spacing",       "spacing");
  const borderRadiusTokens = buildCategory(raw["border-radius"], "border-radius", "borderRadius");
  const shadowTokens       = buildCategory(raw.shadow,           "shadow",        "shadow");

  // Typography — flatten manually for richer structure
  const typographyTokens = [
    ...flattenTokens(raw.typography["font-family"], "--vyre-typography-font-family").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      category: "typography", subcategory: "font-family", value: String(value), description: desc,
    })),
    ...flattenTokens(raw.typography["font-size"], "--vyre-typography-font-size").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()),
      category: "typography", subcategory: "font-size", value: String(value), description: desc,
    })),
    ...flattenTokens(raw.typography["font-weight"], "--vyre-typography-font-weight").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      category: "typography", subcategory: "font-weight", value: String(value), description: desc,
    })),
    ...flattenTokens(raw.typography["line-height"], "--vyre-typography-line-height").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      category: "typography", subcategory: "line-height", value: String(value), description: desc,
    })),
  ];

  const transitionTokens = [
    ...flattenTokens(raw.transition.duration, "--vyre-transition-duration").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      category: "transition", subcategory: "duration", value: String(value), description: desc,
    })),
    ...flattenTokens(raw.transition.easing, "--vyre-transition-easing").map(([cssVar, value, desc]) => ({
      name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
      category: "transition", subcategory: "easing", value: String(value), description: desc,
    })),
  ];

  const zIndexTokens = flattenTokens(raw["z-index"], "--vyre-z-index").map(([cssVar, value, desc]) => ({
    name: cssVar.replace("--vyre-", "").replace(/-/g, "."), cssVar, jsKey: cssVar.replace("--vyre-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
    category: "zIndex", value: String(value), description: desc,
  }));

  return {
    $schema:     "https://usevyre.com/schemas/ai-tokens-v1.json",
    version,
    generatedAt: new Date().toISOString(),
    description: "useVyre design tokens — machine-readable reference for AI agents. Use semantic color tokens; never use primitive tokens directly in components.",
    naming: {
      convention:    "--vyre-[category]-[subcategory]-[variant]",
      cssPrefix:     "--vyre-",
      themeAttribute:"data-theme",
      themeValues:   ["light", "dark"],
      themeDefault:  "light",
    },
    rules: [
      "NEVER use primitive tokens (--vyre-color-primitive-*) in components — use semantic tokens instead.",
      "Semantic tokens adapt automatically to light/dark theme via [data-theme] attribute on <html>.",
      "For interactive hover states, use the -hover suffix variant of the token.",
      "For low-opacity backgrounds (badges, highlights), use -subtle suffix tokens.",
      "Text hierarchy: text-primary > text-secondary > text-muted > text-disabled.",
      "For text on accent/colored backgrounds, use text-inverse or accent-foreground.",
      "Import CSS: @import \"@usevyre/tokens/css\". Import JS: import { tokens } from \"@usevyre/tokens\".",
      "Use cssVar() helper to reference tokens in JS: cssVar('color-semantic-accent') → var(--vyre-color-semantic-accent).",
    ],
    categories: {
      color: {
        description: "Color tokens. Use semantic tokens in all components. Primitive tokens are raw palette values — internal use only.",
        primitive: {
          description: "Raw color palette. DO NOT USE DIRECTLY in components — use semantic tokens.",
          note: "Reference: @usevyre/tokens/json → color.primitive",
        },
        semantic: semanticTokens,
      },
      spacing:      { description: "4px base grid. Use for padding, margin, gap.", tokens: spacingTokens },
      typography:   { description: "Font families, sizes, weights, line heights.", tokens: typographyTokens },
      borderRadius: { description: "Corner radii. md (8px) is default for most components.", tokens: borderRadiusTokens },
      shadow:       { description: "Elevation shadows. -dark variants for dark theme.", tokens: shadowTokens },
      transition:   { description: "Duration and easing for animations.", tokens: transitionTokens },
      zIndex:       { description: "Z-index stacking scale.", tokens: zIndexTokens },
    },
  };
}

// ── 7. Build ai-tokens.md ─────────────────────────────────────
function buildAITokensMD() {
  const version = getVersion();
  const json = buildAITokensJSON();
  const semantic = json.categories.color.semantic;

  const rulesList = json.rules.map((r, i) => `${i + 1}. ${r}`).join("\n");

  // Semantic color table
  const semanticTable = [
    "| CSS Variable | Description | Light | Dark | Usage |",
    "|---|---|---|---|---|",
    ...semantic.map(t =>
      `| \`${t.cssVar}\` | ${t.description} | \`${t.values.light}\` | \`${t.values.dark ?? "—"}\` | ${(t.usage ?? []).slice(0, 2).join(", ")} |`
    ),
  ].join("\n");

  // Spacing
  const spacingRows = json.categories.spacing.tokens
    .map(t => `| \`${t.cssVar}\` | \`${t.value}\` | ${t.description} |`).join("\n");

  // Border radius
  const radiusRows = json.categories.borderRadius.tokens
    .map(t => `| \`${t.cssVar}\` | \`${t.value}\` | ${t.description} |`).join("\n");

  // Typography font size
  const fontSizeRows = json.categories.typography.tokens
    .filter(t => t.subcategory === "font-size")
    .map(t => `| \`${t.cssVar}\` | \`${t.value}\` | ${t.description} |`).join("\n");

  // Shadow
  const shadowRows = json.categories.shadow.tokens
    .map(t => `| \`${t.cssVar}\` | ${t.description || "—"} |`).join("\n");

  // Transition
  const durationRows = json.categories.transition.tokens
    .filter(t => t.subcategory === "duration")
    .map(t => `| \`${t.cssVar}\` | \`${t.value}\` |`).join("\n");

  // Z-index
  const zIndexRows = json.categories.zIndex.tokens
    .map(t => `| \`${t.cssVar}\` | \`${t.value}\` | ${t.description} |`).join("\n");

  return `# useVyre Token Reference for AI Agents
# Version: ${version} | Generated: ${new Date().toISOString().slice(0, 10)}
# Machine-readable version: @usevyre/tokens/ai (ai-tokens.json)

## Usage

\`\`\`css
/* CSS */
@import "@usevyre/tokens/css";
color: var(--vyre-color-semantic-accent);
\`\`\`

\`\`\`ts
/* TypeScript/JS */
import { tokens, cssVar } from "@usevyre/tokens";
const accent = tokens["colorSemanticAccent"]; // resolved hex value
const css    = cssVar("color-semantic-accent"); // "var(--vyre-color-semantic-accent)"
\`\`\`

## Rules

${rulesList}

---

## Semantic Color Tokens

These are the tokens to use in all component styling. They switch automatically between light/dark.

${semanticTable}

---

## Spacing (4px grid)

| CSS Variable | Value | Notes |
|---|---|---|
${spacingRows}

---

## Border Radius

| CSS Variable | Value | Notes |
|---|---|---|
${radiusRows}

---

## Typography — Font Sizes

| CSS Variable | Value | Notes |
|---|---|---|
${fontSizeRows}

**Font weights:** light (300), regular (400), medium (500), semibold (600), bold (700)
Use \`--vyre-typography-font-weight-[name]\`.

**Font families:**
- Display/Body: \`--vyre-typography-font-family-display\` / \`--vyre-typography-font-family-body\` → Geist, Inter, system-ui
- Mono: \`--vyre-typography-font-family-mono\` → Geist Mono, JetBrains Mono

---

## Shadows

| CSS Variable | Notes |
|---|---|
${shadowRows}

Use \`-dark\` variants inside \`[data-theme="dark"]\`. \`glow-accent\` and \`glow-teal\` for focus glows.

---

## Transitions — Duration

| CSS Variable | Value |
|---|---|
${durationRows}

**Easing:** \`--vyre-transition-easing-out\` (default), \`-in\`, \`-inout\`, \`-spring\` (bounce)

---

## Z-Index Scale

| CSS Variable | Value | Layer |
|---|---|---|
${zIndexRows}

---

## Common Mistakes

- ❌ Using raw hex values → ✅ Use \`var(--vyre-color-semantic-accent)\`
- ❌ \`--vyre-color-primitive-violet-600\` in a component → ✅ \`--vyre-color-semantic-accent\`
- ❌ Custom z-index numbers → ✅ Use \`var(--vyre-z-index-modal)\`
- ❌ Hardcoded px spacing → ✅ Use \`var(--vyre-spacing-4)\` (= 16px)
`;
}

// ── Run ───────────────────────────────────────────────────────
writeFileSync(resolve(DIST, "vyre.css"),        buildCSS());
writeFileSync(resolve(DIST, "tokens.js"),       buildJS());
writeFileSync(resolve(DIST, "tokens.d.ts"),     buildDTS());
writeFileSync(resolve(DIST, "tokens.json"),     readFileSync(SRC));
writeFileSync(resolve(DIST, "ai-context.md"),   buildAIContext());
writeFileSync(resolve(DIST, "ai-tokens.json"),  JSON.stringify(buildAITokensJSON(), null, 2));
writeFileSync(resolve(DIST, "ai-tokens.md"),    buildAITokensMD());

// index.js re-exports everything
writeFileSync(resolve(DIST, "index.js"),   `export * from "./tokens.js";\n`);
writeFileSync(resolve(DIST, "index.d.ts"), `export * from "./tokens.d.ts";\n`);

const lightCount = Object.keys(raw.color["semantic-light"]).filter(k => !k.startsWith("$")).length;
const darkCount  = Object.keys(raw.color["semantic-dark"]).filter(k => !k.startsWith("$")).length;

console.log(`✅ @usevyre/tokens built — light: ${lightCount} semantic, dark: ${darkCount} semantic`);
console.log(`   dist/vyre.css        — CSS variables (light + dark theme)`);
console.log(`   dist/tokens.js       — JS/TS export`);
console.log(`   dist/tokens.json     — DTCG-compliant source`);
console.log(`   dist/ai-context.md   — AI prompt context (basic)`);
console.log(`   dist/ai-tokens.json  — AI token reference (structured, machine-readable)`);
console.log(`   dist/ai-tokens.md    — AI token reference (rich markdown for prompts)`);
