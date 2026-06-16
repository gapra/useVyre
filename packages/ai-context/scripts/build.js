import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = resolve(root, "src");
const dist = resolve(root, "dist");

mkdirSync(dist, { recursive: true });

// ── Load source data ──────────────────────────────────────────────────────────

const schema = JSON.parse(readFileSync(resolve(src, "schema/components.json"), "utf8"));
const staticContext = readFileSync(resolve(src, "full-context.md"), "utf8");

// Composition blocks: copy-paste page/section patterns built from existing
// components. Each src/blocks/*.md is a complete reference (description + React
// + Vue) injected into the AI context so agents compose pages correctly.
function loadBlocks() {
  const dir = resolve(src, "blocks");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const md = readFileSync(resolve(dir, f), "utf8").trim();
      const name = md.match(/^# (.+)$/m)?.[1] ?? f.replace(/\.md$/, "");
      return { name, md };
    });
}
const blocks = loadBlocks();

// Load AI tokens from @usevyre/tokens (sibling package in monorepo)
const tokensDistPath = resolve(__dirname, "../../tokens/dist/ai-tokens.json");
const tokensMDPath   = resolve(__dirname, "../../tokens/dist/ai-tokens.md");
const aiTokens    = existsSync(tokensDistPath) ? JSON.parse(readFileSync(tokensDistPath, "utf8")) : null;
const aiTokensMD  = existsSync(tokensMDPath)   ? readFileSync(tokensMDPath, "utf8") : null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildComponentSection(name, comp) {
  const lines = [];

  lines.push(`### ${name}`);
  lines.push("");
  lines.push(comp.description);
  lines.push("");

  lines.push("```tsx");
  lines.push(comp.import);
  lines.push("");

  const props = comp.props || {};
  const propNames = Object.keys(props);
  if (propNames.length > 0) {
    lines.push("// Props:");
    for (const [propName, prop] of Object.entries(props)) {
      const vals = prop.values ? `"${prop.values.join('" | "')}"` : prop.type;
      const def = prop.default !== undefined ? ` (default: ${prop.default})` : "";
      lines.push(`// ${propName.padEnd(14)} = ${vals}${def}`);
    }
    lines.push("");
  }

  if (comp.examples?.length) {
    lines.push("// Examples:");
    for (const ex of comp.examples) {
      lines.push(ex.code);
    }
  }

  lines.push("```");
  lines.push("");

  if (comp.antiPatterns?.length) {
    lines.push("**Common mistakes:**");
    for (const ap of comp.antiPatterns) {
      lines.push(`- ❌ \`${ap.pattern}\` → ${ap.fix}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function buildCursorRulesSection(name, comp) {
  const lines = [];
  lines.push(`## ${name}`);
  lines.push(comp.description);

  // Extract package name from import string
  const pkgMatch = comp.import.match(/"([^"]+)"/);
  const pkg = pkgMatch ? pkgMatch[1] : "@usevyre/react";
  const symbolMatch = comp.import.match(/import \{([^}]+)\}/);
  const symbols = symbolMatch ? symbolMatch[1].trim() : name;
  lines.push(`Import: \`import { ${symbols} } from "${pkg}"\``);
  lines.push("");

  const props = comp.props || {};
  if (Object.keys(props).length > 0) {
    lines.push("Valid props:");
    for (const [propName, prop] of Object.entries(props)) {
      if (prop.values) {
        const def = prop.default !== undefined ? ` [default: ${prop.default}]` : "";
        lines.push(`- ${propName}: ${prop.values.map(v => `"${v}"`).join(" | ")}${def}`);
      }
    }
    lines.push("");
  }

  if (comp.antiPatterns?.length) {
    lines.push("Never do:");
    for (const ap of comp.antiPatterns) {
      lines.push(`- ❌ ${ap.pattern} → ✅ ${ap.fix}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── Generate component sections from schema ───────────────────────────────────

const componentSections = Object.entries(schema.components)
  .map(([name, comp]) => buildComponentSection(name, comp))
  .join("\n---\n\n");

const cursorSections = Object.entries(schema.components)
  .map(([name, comp]) => buildCursorRulesSection(name, comp))
  .join("\n");

// Collect all anti-patterns for hallucination guard section
const allAntiPatterns = Object.entries(schema.components).flatMap(([name, comp]) =>
  (comp.antiPatterns || []).map(ap => ({ component: name, ...ap }))
);

const antiPatternBlock = allAntiPatterns
  .map(ap => `- ❌ \`<${ap.component} ${ap.pattern}>\` → ${ap.fix}`)
  .join("\n");

// ── Build full-context.md (schema-driven component section, static tokens/rules) ──

// Split static content at the Component API Reference section boundary
const splitMarker = "## Component API Reference";
const stylingMarker = "## Styling Rules for AI Agents";

const staticUpToComponents = staticContext.includes(splitMarker)
  ? staticContext.split(splitMarker)[0].trimEnd()
  : staticContext.split(stylingMarker)[0].trimEnd();

const staticStylingOnward = staticContext.includes(stylingMarker)
  ? staticContext.split(stylingMarker)[1].trimStart()
  : "";

const blocksIntro =
  "Ready-made compositions of useVyre components for whole sections/pages. " +
  "Copy, paste, and adapt — they are a starting point, not fixed components. " +
  "Prefer composing a page from these patterns over inventing layout from scratch.";

const blocksSection = blocks.length
  ? [
      "## Composition Blocks",
      "",
      blocksIntro,
      "",
      blocks.map((b) => b.md).join("\n\n---\n\n"),
      "",
      "---",
      "",
    ].join("\n")
  : "";

const generatedFullContext = [
  staticUpToComponents,
  "",
  "## Component API Reference",
  "",
  componentSections,
  "---",
  "",
  blocksSection,
  "## Hallucination Guard — Common AI Mistakes",
  "",
  "The following prop values and patterns do NOT exist in useVyre.",
  "If you generate these, you are hallucinating.",
  "",
  antiPatternBlock,
  "",
  "---",
  "",
  "## Styling Rules for AI Agents",
  "",
  staticStylingOnward,
].join("\n");

// Write back to src so full-context.md stays in sync (schema is source of truth for components)
writeFileSync(resolve(src, "full-context.md"), generatedFullContext);
writeFileSync(resolve(dist, "full-context.md"), generatedFullContext);

// Standalone blocks reference (also consumable on its own / by MCP later)
const blocksDoc = [
  "# useVyre Composition Blocks",
  "",
  blocksIntro,
  "",
  blocks.map((b) => b.md).join("\n\n---\n\n"),
  "",
].join("\n");
writeFileSync(resolve(dist, "blocks.md"), blocksDoc);

// ── cursor-rules.md ───────────────────────────────────────────────────────────

const cursorRules = [
  "---",
  "description: useVyre design system rules — follow these when writing UI code",
  "alwaysApply: true",
  "---",
  "",
  "# useVyre Design System — Cursor Rules",
  "# Version: " + schema.version,
  "",
  "You are working in a project using the useVyre design system (@usevyre/react).",
  "Follow these rules strictly when generating any UI code.",
  "",
  "## Critical Rules",
  "- NEVER use color/size values that are not in the valid prop lists below",
  "- ALWAYS use semantic tokens (--vyre-color-semantic-*), never hardcode colors",
  "- ALWAYS add aria-label to Button size=\"icon\" (no visible text)",
  "- NEVER render <Toast> directly — use useToast() hook",
  "- NEVER use <Input type=\"search\"> for search UI — use Command component",
  "- useVyre ships NO icons — import from lucide-react (or any) and pass a node to icon/leftIcon/leftElement; never @usevyre/icons or icon=\"name\"",
  "",
  "## Component Rules",
  "",
  cursorSections,
  "## Token Rules",
  "",
  "Use --vyre-color-semantic-* for all colors. Never use primitive tokens.",
  "Use --vyre-spacing-* for all spacing. Never use raw px in component code.",
  "Use --vyre-border-radius-* for border radius.",
].join("\n");

writeFileSync(resolve(dist, "cursor-rules.md"), cursorRules);

// ── claude-context.md ─────────────────────────────────────────────────────────

const claudeContext = [
  "# useVyre Design System Context",
  "# Version: " + schema.version,
  "",
  "You are working in a codebase that uses the useVyre design system.",
  "Follow the rules below strictly when writing any UI code.",
  "",
  generatedFullContext,
].join("\n");

writeFileSync(resolve(dist, "claude-context.md"), claudeContext);

// ── windsurf-rules.md ─────────────────────────────────────────────────────────

const windsurfRules = [
  "# useVyre Rules for Windsurf",
  "# Version: " + schema.version,
  "",
  generatedFullContext,
].join("\n");

writeFileSync(resolve(dist, "windsurf-rules.md"), windsurfRules);

// ── copilot-instructions.md ───────────────────────────────────────────────────

const copilotInstructions = [
  "# useVyre Copilot Instructions",
  "# Version: " + schema.version,
  "",
  "When generating UI code in this project, follow the useVyre design system rules below.",
  "",
  generatedFullContext,
].join("\n");

writeFileSync(resolve(dist, "copilot-instructions.md"), copilotInstructions);

// ── schema.json — machine-readable component schema ───────────────────────────

writeFileSync(resolve(dist, "schema.json"), JSON.stringify(schema, null, 2));

// ── version-info.json — 1.4 AI Context Versioning ────────────────────────────

const versionInfo = {
  version: schema.version,
  packageVersion: schema.packageVersion ?? "0.1.1",
  generatedAt: new Date().toISOString(),
  validFor: schema.validFor ?? [],
  changelog: schema.changelog ?? {},
  components: Object.fromEntries(
    Object.entries(schema.components).map(([name, comp]) => [
      name,
      {
        version: comp.meta?.version ?? schema.packageVersion ?? "0.1.1",
        lastUpdated: comp.meta?.lastUpdated ?? schema.generatedAt,
        breaking: comp.meta?.breaking ?? false,
        stable: comp.meta?.stable ?? true,
        changelog: comp.meta?.changelog ?? null,
      },
    ])
  ),
};

writeFileSync(resolve(dist, "version-info.json"), JSON.stringify(versionInfo, null, 2));

// ── cheat-sheets/ — 2.1 per-component AI Cheat Sheet (markdown) ──────────────

const cheatSheetsDir = resolve(dist, "cheat-sheets");
mkdirSync(cheatSheetsDir, { recursive: true });

function buildCheatSheet(name, comp) {
  const props = comp.props ?? {};
  const enumProps = Object.entries(props).filter(([, p]) => p.values);
  const boolProps = Object.entries(props).filter(([, p]) => p.type === "boolean");

  const lines = [];
  lines.push(`# ${name} — AI Cheat Sheet`);
  lines.push(`> Quick reference for Claude / Cursor / Copilot`);
  lines.push("");
  lines.push(`**${comp.description}**`);
  lines.push("");
  lines.push(`\`\`\`ts`);
  lines.push(comp.import);
  lines.push(`\`\`\``);
  lines.push("");

  if (enumProps.length > 0 || boolProps.length > 0) {
    lines.push("## Valid Props");
    lines.push("");
    lines.push("| Prop | Values | Default |");
    lines.push("|------|--------|---------|");
    for (const [propName, prop] of enumProps) {
      const vals = prop.values.map(v => `\`"${v}"\``).join(" \\| ");
      const def = prop.default !== undefined ? `\`${prop.default}\`` : "—";
      lines.push(`| \`${propName}\` | ${vals} | ${def} |`);
    }
    for (const [propName, prop] of boolProps) {
      const def = prop.default !== undefined ? `\`${prop.default}\`` : "—";
      lines.push(`| \`${propName}\` | \`true\` \\| \`false\` | ${def} |`);
    }
    lines.push("");
  }

  if (comp.antiPatterns?.length) {
    lines.push("## Common AI Mistakes");
    lines.push("");
    for (const ap of comp.antiPatterns) {
      lines.push(`- ❌ \`${ap.pattern}\``);
      lines.push(`  → ${ap.fix}`);
    }
    lines.push("");
  }

  if (comp.examples?.length) {
    lines.push("## Examples");
    lines.push("");
    for (const ex of comp.examples) {
      lines.push(`**${ex.description}**`);
      lines.push("```tsx");
      lines.push(ex.code);
      lines.push("```");
      lines.push("");
    }
  }

  if (comp.accessibility?.notes?.length) {
    lines.push("## Accessibility");
    lines.push("");
    for (const note of comp.accessibility.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// Index of all cheat sheets
const cheatSheetIndex = ["# useVyre Component Cheat Sheets", "", "Quick reference for AI agents — one file per component.", ""];

for (const [name, comp] of Object.entries(schema.components)) {
  const content = buildCheatSheet(name, comp);
  const filename = `${name.toLowerCase()}.md`;
  writeFileSync(resolve(cheatSheetsDir, filename), content);
  cheatSheetIndex.push(`- [${name}](${filename}) — ${comp.description}`);
}

writeFileSync(resolve(cheatSheetsDir, "index.md"), cheatSheetIndex.join("\n") + "\n");

// ── anti-patterns.json — hallucination guard, usable by ESLint/validate CLI ──

const antiPatternsExport = {
  version: schema.version,
  rules: allAntiPatterns.map(ap => ({
    component: ap.component,
    pattern: ap.pattern,
    reason: ap.reason,
    fix: ap.fix,
    severity: ap.severity ?? "error",
  })),
};

writeFileSync(resolve(dist, "anti-patterns.json"), JSON.stringify(antiPatternsExport, null, 2));

// ── index.js — JS entry exporting all context strings + structured data ───────

const escape = (s) => s.replace(/`/g, "\\`").replace(/\$/g, "\\$");

// Build cheat sheets map for index.js export
const cheatSheetsMap = Object.fromEntries(
  Object.entries(schema.components).map(([name, comp]) => [name, buildCheatSheet(name, comp)])
);

const indexContent = [
  `// @usevyre/ai-context v${schema.version}`,
  `// Auto-generated — do not edit directly. Edit src/schema/components.json instead.`,
  "",
  `export const version = "${schema.version}";`,
  "",
  `export const fullContext = \`${escape(generatedFullContext)}\`;`,
  `export const cursorRules = \`${escape(cursorRules)}\`;`,
  `export const claudeContext = \`${escape(claudeContext)}\`;`,
  `export const windsurfRules = \`${escape(windsurfRules)}\`;`,
  `export const copilotInstructions = \`${escape(copilotInstructions)}\`;`,
  "",
  `export const schema = ${JSON.stringify(schema, null, 2)};`,
  "",
  `export const antiPatterns = ${JSON.stringify(antiPatternsExport, null, 2)};`,
  "",
  `export const versionInfo = ${JSON.stringify(versionInfo, null, 2)};`,
  "",
  `export const cheatSheets = ${JSON.stringify(cheatSheetsMap, null, 2)};`,
  "",
].join("\n");

writeFileSync(resolve(dist, "index.js"), indexContent);

// ── Copy AI tokens from @usevyre/tokens ──────────────────────────────────────

if (aiTokens) {
  writeFileSync(resolve(dist, "tokens.json"), JSON.stringify(aiTokens, null, 2));
}
if (aiTokensMD) {
  writeFileSync(resolve(dist, "tokens.md"), aiTokensMD);
}

// ── Update package.json exports to include new files ─────────────────────────

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
pkg.exports = {
  ".": "./dist/index.js",
  "./cursor": "./dist/cursor-rules.md",
  "./claude": "./dist/claude-context.md",
  "./windsurf": "./dist/windsurf-rules.md",
  "./copilot": "./dist/copilot-instructions.md",
  "./full": "./dist/full-context.md",
  "./schema": "./dist/schema.json",
  "./anti-patterns": "./dist/anti-patterns.json",
  "./version-info": "./dist/version-info.json",
  "./cheat-sheets": "./dist/cheat-sheets/index.md",
  "./tokens": "./dist/tokens.json",
  "./tokens-md": "./dist/tokens.md",
};
writeFileSync(resolve(root, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

// ── Summary ───────────────────────────────────────────────────────────────────

const componentCount = Object.keys(schema.components).length;
const antiPatternCount = allAntiPatterns.length;

console.log(`@usevyre/ai-context v${schema.version} built successfully`);
console.log(`  ${componentCount} components · ${antiPatternCount} anti-patterns`);
console.log(`  dist/schema.json`);
console.log(`  dist/anti-patterns.json`);
console.log(`  dist/version-info.json`);
console.log(`  dist/cheat-sheets/ (${componentCount} files + index.md)`);
console.log(`  dist/full-context.md`);
console.log(`  dist/cursor-rules.md`);
console.log(`  dist/claude-context.md`);
console.log(`  dist/windsurf-rules.md`);
console.log(`  dist/copilot-instructions.md`);
console.log(`  dist/tokens.json     — AI token reference (from @usevyre/tokens)`);
console.log(`  dist/tokens.md       — AI token reference markdown`);
console.log(`  dist/index.js`);
