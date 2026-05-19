/**
 * Callback-prop drift — the audit that caught the worst class of bug.
 *
 * schema-component-sync.test.ts proves the schema's import strings resolve.
 * But a schema entry can still advertise a PROP that the component doesn't
 * accept. For callbacks this fails silently: the agent writes
 * `<Switch onChange={fn}>`, the handler never fires, nothing errors. The
 * shipped validate-ai-context can't catch it (it only checks props the
 * schema lists, never schema-vs-code).
 *
 * This test parses the BUILT .d.ts type declarations (what TypeScript
 * actually enforces on consumers) and asserts every function-typed prop in
 * the schema is a real prop of the component — or is in KNOWN_DRIFT with the
 * correct prop name. When a drift is fixed, this test fails until its
 * KNOWN_DRIFT entry is removed, so the schema and the docs move together.
 *
 * Requires `pnpm -r build` (reads packages/react/dist).
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCHEMA = resolve(ROOT, "packages/ai-context/src/schema/components.json");
const DIST = resolve(ROOT, "packages/react/dist/components");

/**
 * Confirmed schema↔code drift, keyed by component → { schemaProp: realProp }.
 *
 * History: the 2026-05-19 audit found 4 drifts (Switch/Checkbox onChange→
 * onCheckedChange, Slider onChange→onValueChange, Pagination onChange→
 * onPageChange). All were fixed in schema v1.16.1, so the list is now empty.
 *
 * If a future schema change reintroduces a callback the component doesn't
 * have, the "every schema callback prop is a real component prop" test fails
 * until either the schema is fixed or the drift is consciously recorded here.
 */
const KNOWN_DRIFT: Record<string, Record<string, string>> = {};

type Schema = {
  components: Record<
    string,
    { props?: Record<string, { type?: string }> }
  >;
};
const schema: Schema = JSON.parse(readFileSync(SCHEMA, "utf8"));

// Collect every prop identifier declared across a component's .d.ts files.
// Components whose dist folder name differs from the schema key are mapped.
// Components whose dist folder name differs from the schema key. (Only the
// ones that are genuinely co-located — DateRangePicker has its own folder.)
const DIR_ALIAS: Record<string, string> = {
  AlertDialog: "Alert",
  DatePicker: "Calendar",
  RadioGroup: "Radio",
};

/**
 * Every prop-like identifier declared anywhere in a component's .d.ts files.
 * Deliberately broad: useVyre uses `interface XProps`, `type XProps = A | B`,
 * and intersection types, so scoping to a single named interface misses real
 * props (false drift). The question we answer is "is `prop` a member of this
 * component's public type at all" — a union over all .d.ts members is the
 * right tool, and it cannot manufacture a prop that isn't written down.
 */
function declaredProps(name: string): Set<string> | null {
  const dir = resolve(DIST, DIR_ALIAS[name] ?? name);
  if (!existsSync(dir)) return null;
  const props = new Set<string>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".d.ts"))) {
    const txt = readFileSync(resolve(dir, f), "utf8");
    // Strip block comments so example code in JSDoc never counts as a prop.
    const code = txt.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const pm of code.matchAll(/(?:^|[{;,])\s*"?([A-Za-z_]\w*)"?\??\s*:/gm)) {
      props.add(pm[1]);
    }
  }
  return props;
}

describe("schema callback-prop drift", () => {
  const fnProps: [string, string][] = [];
  for (const [name, c] of Object.entries(schema.components)) {
    for (const [p, def] of Object.entries(c.props ?? {})) {
      if (def.type === "function") fnProps.push([name, p]);
    }
  }

  it("audited a meaningful number of callback props", () => {
    // Guards against the parser silently finding nothing.
    expect(fnProps.length).toBeGreaterThan(20);
  });

  it("every schema callback prop is a real component prop (or known drift)", () => {
    const unexpected: string[] = [];
    for (const [name, prop] of fnProps) {
      const declared = declaredProps(name);
      if (!declared || declared.size === 0) continue; // no parseable d.ts
      if (declared.has(prop)) continue; // matches real prop �→ good
      const known = KNOWN_DRIFT[name]?.[prop];
      if (known) {
        // The drift is known — assert the *real* prop still exists, so this
        // entry stays meaningful and isn't masking a second rename.
        expect(
          declared.has(known),
          `${name}: KNOWN_DRIFT says real prop is "${known}" but it's not declared`,
        ).toBe(true);
        continue;
      }
      unexpected.push(
        `${name}.${prop}: schema advertises it but component has no such prop ` +
          `(real props incl: ${[...declared].filter((x) => x.startsWith("on")).join(", ")})`,
      );
    }
    expect(unexpected, unexpected.join("\n")).toEqual([]);
  });

  it("known-drift list stays minimal — fail if a fixed drift lingers here", () => {
    // The drift exists only while the SCHEMA still advertises the wrong
    // prop. Once the schema is corrected (prop renamed to the real one),
    // the entry is stale and must be deleted — otherwise KNOWN_DRIFT rots
    // into a list of lies. We check the schema, not the .d.ts (the .d.ts
    // never had the wrong prop, so checking it can never detect the fix).
    const stale: string[] = [];
    for (const [name, map] of Object.entries(KNOWN_DRIFT)) {
      const schemaProps = schema.components[name]?.props ?? {};
      for (const schemaProp of Object.keys(map)) {
        if (!(schemaProp in schemaProps)) {
          stale.push(
            `${name}.${schemaProp}: schema no longer advertises it — ` +
              `drift is fixed, remove this entry from KNOWN_DRIFT`,
          );
        }
      }
    }
    expect(stale, stale.join("\n")).toEqual([]);
  });
});
