/**
 * Schema internal integrity.
 *
 * Even when every component exists (see schema-component-sync.test.ts), a
 * malformed or self-contradictory schema entry still poisons agent output:
 * an enum with no values, a default outside its own value list, or an
 * anti-pattern that warns against a value the same prop actually accepts.
 * These are the bugs that produce confident-but-wrong AI code, so they are
 * asserted here as hard invariants.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCHEMA_PATH = resolve(ROOT, "packages/ai-context/src/schema/components.json");
const ANTIPATTERNS_PATH = resolve(ROOT, "packages/ai-context/dist/anti-patterns.json");

type Prop = {
  type?: string;
  values?: string[];
  default?: unknown;
  description?: string;
};
type Component = {
  description?: string;
  import?: string;
  props?: Record<string, Prop>;
  antiPatterns?: { pattern: string; reason?: string; fix?: string }[];
  examples?: { description?: string; code?: string }[];
};
type Schema = {
  version: string;
  packageVersion?: string;
  components: Record<string, Component>;
};

const schema: Schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
const entries = Object.entries(schema.components);

describe("schema integrity", () => {
  it("every component has a non-empty description", () => {
    const bad = entries
      .filter(([, c]) => !c.description || c.description.trim().length < 3)
      .map(([n]) => n);
    expect(bad, `components missing description: ${bad}`).toEqual([]);
  });

  it("every enum prop has a non-empty values array", () => {
    const bad: string[] = [];
    for (const [name, c] of entries) {
      for (const [p, def] of Object.entries(c.props ?? {})) {
        if (def.type === "enum" && (!def.values || def.values.length === 0)) {
          bad.push(`${name}.${p}`);
        }
      }
    }
    expect(bad, `enum props with no values: ${bad}`).toEqual([]);
  });

  it("every prop default is within its own enum values", () => {
    const bad: string[] = [];
    for (const [name, c] of entries) {
      for (const [p, def] of Object.entries(c.props ?? {})) {
        if (def.type !== "enum" || def.default === undefined) continue;
        // Compare with the same primitive type the schema uses (enum values
        // may legitimately be numbers, e.g. weekStartsOn: [0, 1]).
        const ok = def.values?.some((v) => v === def.default);
        if (!ok) {
          bad.push(`${name}.${p}: default ${JSON.stringify(def.default)} not in ${JSON.stringify(def.values)}`);
        }
      }
    }
    expect(bad, bad.join("\n")).toEqual([]);
  });

  it("no anti-pattern warns against a value the same prop actually accepts", () => {
    // e.g. Button.variant accepts "accent"; an antiPattern of
    // `variant="accent"` would tell the agent to avoid a valid value.
    const contradictions: string[] = [];
    for (const [name, c] of entries) {
      for (const ap of c.antiPatterns ?? []) {
        // Only an UNCONDITIONAL `prop="value"` is a real contradiction.
        // Conditional patterns like `size="icon" without aria-label` or
        // `type="multiple" with a string value` flag a misuse of a valid
        // value — legitimate guidance, not a contradiction.
        const m = ap.pattern.match(/^(\w+)="([^"]+)"$/);
        if (!m) continue;
        const [, prop, value] = m;
        const def = c.props?.[prop];
        if (def?.type === "enum" && def.values?.includes(value)) {
          contradictions.push(
            `${name}: antiPattern \`${ap.pattern}\` but "${value}" is a valid ${prop} value`,
          );
        }
      }
    }
    expect(contradictions, contradictions.join("\n")).toEqual([]);
  });

  it("schema version and packageVersion agree", () => {
    if (schema.packageVersion !== undefined) {
      expect(schema.version).toBe(schema.packageVersion);
    }
  });

  it("dist anti-patterns version matches schema version (regenerated, not stale)", () => {
    const ap = JSON.parse(readFileSync(ANTIPATTERNS_PATH, "utf8")) as {
      version: string;
    };
    expect(ap.version).toBe(schema.version);
  });
});
