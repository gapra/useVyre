/**
 * Contract integrity — the test that actually guards useVyre's value prop.
 *
 * The AI-facing schema (`packages/ai-context/src/schema/components.json`) is
 * HAND-WRITTEN, not generated from the components. `build.js` only reads and
 * redistributes it. So nothing structurally guarantees the schema an agent
 * reads matches the code that ships. If they drift, an agent gets a confident
 * but false contract and hallucinates code that compiles against docs which
 * lie — exactly the failure useVyre exists to prevent.
 *
 * This suite asserts: every symbol the schema tells an agent to import is a
 * real export of the built @usevyre/react (and @usevyre/vue) package.
 *
 * Requires the packages to be built first (`pnpm -r build`); the test fails
 * loudly with guidance if dist is missing rather than silently passing.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const SCHEMA_PATH = resolve(
  ROOT,
  "packages/ai-context/src/schema/components.json",
);
const REACT_DIST = resolve(ROOT, "packages/react/dist/index.js");
const VUE_DIST = resolve(ROOT, "packages/vue/dist/index.js");

type SchemaComponent = {
  description?: string;
  import?: string;
  props?: Record<string, unknown>;
};
type Schema = {
  version: string;
  components: Record<string, SchemaComponent>;
};

const schema: Schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));

/**
 * A schema `import` field can carry both a React and a Vue form, e.g.:
 *   import { useToast, ToastProvider } from "@usevyre/react" // Vue: import { useToast, ToastViewport } from "@usevyre/vue"
 * Pull the symbol list for a given package out of that string.
 */
function symbolsFor(
  importStr: string,
  pkg: "@usevyre/react" | "@usevyre/vue",
): string[] {
  const symbols = new Set<string>();
  const re = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"([^"]+)"/g;
  for (const m of importStr.matchAll(re)) {
    if (m[2] !== pkg) continue;
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) symbols.add(name);
    }
  }
  return [...symbols];
}

let reactExports: Set<string>;
let vueExports: Set<string>;

beforeAll(async () => {
  for (const [label, p] of [
    ["@usevyre/react", REACT_DIST],
    ["@usevyre/vue", VUE_DIST],
  ] as const) {
    if (!existsSync(p)) {
      throw new Error(
        `${label} is not built (${p} missing). Run \`pnpm -r build\` before \`pnpm test\`.`,
      );
    }
  }
  reactExports = new Set(Object.keys(await import(REACT_DIST)));
  vueExports = new Set(Object.keys(await import(VUE_DIST)));
});

describe("schema ↔ component sync", () => {
  it("every schema entry declares an import string", () => {
    const missing = Object.entries(schema.components)
      .filter(([, c]) => !c.import || !c.import.includes("import"))
      .map(([name]) => name);
    expect(missing, `schema entries with no usable import: ${missing}`).toEqual(
      [],
    );
  });

  it("every React symbol the schema advertises is a real @usevyre/react export", () => {
    const broken: string[] = [];
    for (const [name, comp] of Object.entries(schema.components)) {
      for (const sym of symbolsFor(comp.import ?? "", "@usevyre/react")) {
        if (!reactExports.has(sym)) {
          broken.push(`${name}: import { ${sym} } — not exported by @usevyre/react`);
        }
      }
    }
    expect(broken, broken.join("\n")).toEqual([]);
  });

  it("every Vue symbol the schema advertises is a real @usevyre/vue export", () => {
    const broken: string[] = [];
    for (const [name, comp] of Object.entries(schema.components)) {
      for (const sym of symbolsFor(comp.import ?? "", "@usevyre/vue")) {
        if (!vueExports.has(sym)) {
          broken.push(`${name}: import { ${sym} } — not exported by @usevyre/vue`);
        }
      }
    }
    expect(broken, broken.join("\n")).toEqual([]);
  });

  it("no schema entry advertises zero importable React symbols", () => {
    // Catches entries whose import string parses but yields nothing for React
    // (e.g. a malformed package name) — an agent would get an unusable hint.
    const empty = Object.entries(schema.components)
      .filter(([, c]) => symbolsFor(c.import ?? "", "@usevyre/react").length === 0)
      .map(([name]) => name);
    expect(empty, `schema entries with no React symbols: ${empty}`).toEqual([]);
  });
});
