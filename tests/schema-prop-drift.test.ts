/**
 * Schema-vs-code drift — generalized across ALL prop types.
 *
 * `schema-callback-drift.test.ts` audits function-typed props (the most
 * dangerous class — they fail silently). This file generalizes the same
 * machinery to every prop kind. The 2026-05-20 audit ran this manually and
 * surfaced five more drifts (Modal/Sheet `title`, Pagination `total`,
 * Tabs `defaultIndex`/`index`), all fixed in schema v1.16.2. This test now
 * makes the audit permanent.
 *
 * Some schema props are intentionally undeclared in `.d.ts` and must NOT
 * count as drift:
 *
 *   - HTML pass-throughs picked up by `extends *HTMLAttributes` (e.g.
 *     `Button.disabled`, `Label.htmlFor`, `EmptyState.children`).
 *   - Vue-isms (`Input.modelValue`) — the schema is shared with `@usevyre/vue`.
 *   - Sub-component props the parser can't co-locate to the parent (e.g.
 *     `Sidebar.SidebarTrigger.icon`).
 *
 * Those go in ALLOWLIST_SCHEMA_ONLY, with a reason. Adding an entry is a
 * conscious act — if a future audit adds a name here without a stated
 * reason, that's the review gate.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCHEMA = resolve(ROOT, "packages/ai-context/src/schema/components.json");
const DIST = resolve(ROOT, "packages/react/dist/components");

const DIR_ALIAS: Record<string, string> = {
  AlertDialog: "Alert",
  DatePicker: "Calendar",
  RadioGroup: "Radio",
};

/**
 * Schema-only props that are NOT in `.d.ts` but are sound, with a reason.
 * Each entry is the verdict of the 2026-05-20 audit, not a free pass.
 */
const ALLOWLIST_SCHEMA_ONLY: Record<string, Record<string, string>> = {
  Button: { disabled: "HTML native via extends ButtonHTMLAttributes" },
  Checkbox: { disabled: "HTML native via extends Omit<InputHTMLAttributes>" },
  Slider: { disabled: "HTML native via extends Omit<InputHTMLAttributes>" },
  Label: { htmlFor: "HTML native via extends LabelHTMLAttributes" },
  EmptyState: { children: "HTML native via extends Omit<HTMLAttributes>" },
  Input: { modelValue: "Vue v-model binding (schema shared with @usevyre/vue)" },
  Sidebar: {
    "SidebarTrigger.icon": "sub-component prop (SidebarTrigger), parser scope",
    "SidebarTrigger.collapsedIcon": "sub-component prop (SidebarTrigger), parser scope",
  },
};

/** Confirmed schema↔code drift. Empty after the 2026-05-20 v1.16.2 fix. */
const KNOWN_DRIFT: Record<string, Record<string, string>> = {};

type PropDef = { type?: string };
type Schema = {
  components: Record<string, { props?: Record<string, PropDef> }>;
};
const schema: Schema = JSON.parse(readFileSync(SCHEMA, "utf8"));

function declaredProps(name: string): Set<string> | null {
  const dir = resolve(DIST, DIR_ALIAS[name] ?? name);
  if (!existsSync(dir)) return null;
  const props = new Set<string>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".d.ts"))) {
    const txt = readFileSync(resolve(dir, f), "utf8");
    const code = txt.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const pm of code.matchAll(/(?:^|[{;,])\s*"?([A-Za-z_]\w*)"?\??\s*:/gm)) {
      props.add(pm[1]);
    }
  }
  return props;
}

/** All (component, prop) pairs the schema advertises. */
function allSchemaProps(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, c] of Object.entries(schema.components)) {
    for (const p of Object.keys(c.props ?? {})) out.push([name, p]);
  }
  return out;
}

describe("schema prop drift (all prop types)", () => {
  const pairs = allSchemaProps();

  it("audited a meaningful number of props (parser sanity)", () => {
    expect(pairs.length).toBeGreaterThan(150);
  });

  it("every schema prop is in the component's declared type, allowlist, or KNOWN_DRIFT", () => {
    const unexpected: string[] = [];
    for (const [name, prop] of pairs) {
      const declared = declaredProps(name);
      if (!declared || declared.size === 0) continue; // unparseable d.ts
      if (declared.has(prop)) continue;
      if (ALLOWLIST_SCHEMA_ONLY[name]?.[prop]) continue;
      if (KNOWN_DRIFT[name]?.[prop]) {
        // sanity: the real prop must actually exist
        const real = KNOWN_DRIFT[name][prop];
        expect(
          declared.has(real),
          `${name}: KNOWN_DRIFT maps "${prop}" → "${real}", but "${real}" isn't declared`,
        ).toBe(true);
        continue;
      }
      unexpected.push(`${name}.${prop}: schema advertises it; not in .d.ts`);
    }
    expect(unexpected, unexpected.join("\n")).toEqual([]);
  });

  it("KNOWN_DRIFT stays minimal — fail if the schema no longer advertises the wrong prop", () => {
    const stale: string[] = [];
    for (const [name, map] of Object.entries(KNOWN_DRIFT)) {
      const schemaProps = schema.components[name]?.props ?? {};
      for (const schemaProp of Object.keys(map)) {
        if (!(schemaProp in schemaProps)) {
          stale.push(
            `${name}.${schemaProp}: schema no longer advertises it — remove from KNOWN_DRIFT`,
          );
        }
      }
    }
    expect(stale, stale.join("\n")).toEqual([]);
  });

  it("ALLOWLIST_SCHEMA_ONLY entries stay minimal — fail if an allowlisted prop is now in .d.ts", () => {
    // If a parser improvement or a refactor makes the prop discoverable in
    // `.d.ts`, the allowlist entry becomes a lie — remove it.
    const stale: string[] = [];
    for (const [name, map] of Object.entries(ALLOWLIST_SCHEMA_ONLY)) {
      const declared = declaredProps(name);
      if (!declared) continue;
      for (const p of Object.keys(map)) {
        if (declared.has(p)) {
          stale.push(
            `${name}.${p}: now visible in .d.ts — remove from ALLOWLIST_SCHEMA_ONLY`,
          );
        }
      }
    }
    expect(stale, stale.join("\n")).toEqual([]);
  });
});
