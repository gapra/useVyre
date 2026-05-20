/**
 * @usevyre/validate-ai-context behavior.
 *
 * This package IS the safety net — it's what runs in CI to reject
 * AI-hallucinated useVyre code. It previously had zero tests, so the one
 * tool whose entire job is "be correct about correctness" had nothing
 * guaranteeing it stays correct. This suite pins both halves of its
 * contract: it must catch real hallucinations, and it must not raise false
 * positives on valid code (a noisy validator gets disabled, defeating the
 * point).
 */
import { describe, it, expect } from "vitest";
// Tested via the package's public entry, the same surface CI/consumers use.
import {
  validateSnippet,
  validateSource,
  formatResults,
} from "../packages/validate-ai-context/src/index.js";

describe("validate-ai-context — catches hallucinations", () => {
  it("flags a hallucinated prop (color= on Button)", () => {
    const { valid, issues } = validateSnippet(
      '<Button color="red">Save</Button>',
    );
    expect(valid).toBe(false);
    expect(issues.some((i) => i.type === "hallucinated-prop")).toBe(true);
  });

  it("flags an invalid enum value (variant='blurple')", () => {
    const { valid, issues } = validateSnippet(
      '<Button variant="blurple">Save</Button>',
    );
    expect(valid).toBe(false);
    const enumIssue = issues.find((i) => i.type === "invalid-enum-value");
    expect(enumIssue).toBeTruthy();
    expect(enumIssue?.severity).toBe("error");
    // The fix must enumerate the real valid values so an agent can self-correct.
    expect(enumIssue?.fix).toMatch(/"primary"/);
  });

  it("reports every issue when multiple are present in one tag", () => {
    const { issues } = validateSnippet(
      '<Button variant="blurple" color="red">x</Button>',
    );
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });

  it("catches the documented Alert variant='error' hallucination", () => {
    const { valid, issues } = validateSnippet(
      '<Alert variant="error">Failed</Alert>',
    );
    expect(valid).toBe(false);
    expect(issues.find((i) => i.fix?.includes("danger"))).toBeTruthy();
  });
});

describe("validate-ai-context — catches hallucinations in expression form", () => {
  // Same hallucinations as above, but written as `prop={expr}` instead of
  // `prop="literal"`. Real-world AI/human code binds props to variables far
  // more often than to string literals, and the validator was silently blind
  // to that form before the parser fix (it only matched `prop="..."`).
  // These tests guarantee parity: a hallucinated prop must be caught in
  // either form. If they regress, agents/users will write
  //   <Button color={brand}>
  // and pass CI while shipping a non-existent prop.

  it("flags hallucinated prop in expression form (color={brand} on Button)", () => {
    const { valid, issues } = validateSnippet(
      "<Button color={brand}>Save</Button>",
    );
    expect(valid).toBe(false);
    expect(
      issues.some((i) => i.type === "hallucinated-prop" && i.prop === "color"),
    ).toBe(true);
  });

  it("flags icon={...} as hallucinated (canonical schema antiPattern)", () => {
    const { valid, issues } = validateSnippet(
      "<Button icon={<Icon />}>x</Button>",
    );
    expect(valid).toBe(false);
    expect(
      issues.some((i) => i.type === "hallucinated-prop" && i.prop === "icon"),
    ).toBe(true);
  });

  it("handles nested braces in expression values (arrow body, object literal)", () => {
    // The tag has an arrow-body and a JSX-in-expression — these used to
    // truncate tag extraction at the first `>` inside `=>` / `<Icon />`,
    // hiding any hallucinated props that came after. The brace-aware
    // extractor must keep walking and still flag the canonical Button.color
    // hallucination at the end of the tag.
    const { valid, issues } = validateSnippet(
      "<Button onClick={() => save(x)} leftIcon={<Icon />} color={brand}>Go</Button>",
    );
    expect(
      issues.some((i) => i.type === "hallucinated-prop" && i.prop === "color"),
    ).toBe(true);
    expect(valid).toBe(false);
  });
});

describe("validate-ai-context — no false positives", () => {
  it("accepts a fully valid useVyre snippet", () => {
    const { valid, issues } = validateSnippet(
      '<Button variant="primary" size="lg" disabled>Save</Button>',
    );
    expect(issues).toEqual([]);
    expect(valid).toBe(true);
  });

  it("ignores non-useVyre components entirely", () => {
    const { valid } = validateSnippet(
      '<MyCustomThing color="red" foo="bar" />',
    );
    expect(valid).toBe(true);
  });

  it("does not flag className / style / data-testid passthrough", () => {
    const { valid } = validateSnippet(
      '<Button className="x" style="y" data-testid="save">Save</Button>',
    );
    expect(valid).toBe(true);
  });

  it("accepts a valid boolean prop with no value", () => {
    const { valid } = validateSnippet("<Button loading>Save</Button>");
    expect(valid).toBe(true);
  });
});

describe("validate-ai-context — no false positives from contextual antiPatterns", () => {
  // These were the 12 errors validator raised over apps/docs/src (Issue B,
  // 2026-05-19). All three are sound usage; the bug was validator's
  // `pattern.includes("${prop}=")` heuristic treating *any* antiPattern that
  // mentioned `prop=` as proof that prop is hallucinated, even when the
  // antiPattern was guidance about a specific misuse of a valid prop, or
  // about a different component entirely.

  it("Input type='email' is a valid native HTML prop (Input antiPattern guides 'type=search for search UI')", () => {
    // Schema doesn't list `type` (it's an HTML pass-through); a contextual
    // antiPattern about type="search" must not flag type="email".
    const { valid, issues } = validateSnippet(
      '<Input type="email" placeholder="you@example.com" />',
    );
    expect(issues).toEqual([]);
    expect(valid).toBe(true);
  });

  it("DropdownMenu has no variant prop, but DropdownItem does — must not bleed across", () => {
    // antiPattern "DropdownItem variant='primary'" must not flag
    // <DropdownMenu> usages that don't use variant at all.
    const { valid } = validateSnippet(
      "<DropdownMenu trigger={<button>x</button>}>items</DropdownMenu>",
    );
    expect(valid).toBe(true);
  });

  it("Calendar mode='range' is the documented discriminator, not a hallucination", () => {
    // antiPattern "value as tuple for mode='single'" describes a type
    // mismatch within Calendar — `mode` itself is a real, required prop.
    const { valid, issues } = validateSnippet(
      '<Calendar mode="range" value={[start, end]} />',
    );
    expect(issues).toEqual([]);
    expect(valid).toBe(true);
  });

  // Class-coverage guard: the strict matcher must treat EVERY contextual
  // antiPattern shape as non-flagging. This iterates over the live schema —
  // when someone adds a new antiPattern in a future PR, the guard
  // automatically covers it. Failing here means the matcher just regressed
  // to the old `pattern.includes("${prop}=")` semantics and 12 false
  // positives (or a new variant of them) will reappear in CI scans.
  //
  // We don't render JSX in this loop (component prop reality is the audit
  // suite's job); we test the matcher's *classification* directly. Inputs
  // are crafted so any "looks like a prop=" match goes through validator's
  // missing-prop branch, which is the only place the matcher acts.
  it("strict matcher does NOT flag any contextual antiPattern in the live schema", () => {
    // Pull the live antiPattern rules the same way the validator imports them.
    // Reading via the source path keeps the test deterministic across builds.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ap = require("../packages/ai-context/dist/anti-patterns.json") as {
      rules: { component: string; pattern: string }[];
    };

    // A pattern is "deeply declarative" iff it is exactly `prop="..."`,
    // `prop={...}`, or `prop=...` — those are the only forms the validator
    // should ever treat as a hallucinated-prop signal. Everything else is
    // contextual guidance and must not raise a hallucinated-prop issue.
    const declarative = /^(\w+)=("[^"]*"|\{[^}]*\}|\.\.\.)\s*$/;

    const offenders: string[] = [];
    for (const r of ap.rules) {
      if (declarative.test(r.pattern)) continue;
      const m = r.pattern.match(/(\w+)=/);
      if (!m) continue; // pattern doesn't even reference a prop=value form
      const prop = m[1];
      // Probe: a snippet using `${prop}="x"` on this component with no other
      // signal must not be reported as hallucinated-prop. If the prop is
      // declared in schema, validator falls through to enum-check (we don't
      // care here). If the prop is undeclared HTML pass-through, validator
      // must stay silent — that's the contract.
      const snippet = `<${r.component} ${prop}="x" />`;
      const { issues } = validateSnippet(snippet);
      const hallucinated = issues.find(
        (i) => i.type === "hallucinated-prop" && i.prop === prop,
      );
      if (hallucinated) {
        offenders.push(
          `${r.component}.${prop} flagged by contextual antiPattern ${JSON.stringify(r.pattern)}`,
        );
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  // Symmetric guard: declarative antiPatterns that point at a prop the
  // component does NOT actually have (Button.color, Button.icon, etc — the
  // canonical AI hallucinations) must still raise hallucinated-prop. If this
  // regresses, the matcher swung too far and validator lost its teeth.
  //
  // Patterns whose prop IS declared (NumberInput.onChange={(e)=>...},
  // Badge.variant="primary", etc) are out of scope here — those antiPatterns
  // describe signature/value misuse and the JSX validator can't see TS
  // signatures from a string; the enum-value branch covers what it can.
  it("strict matcher DOES flag declarative antiPatterns whose prop is hallucinated", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ap = require("../packages/ai-context/dist/anti-patterns.json") as {
      rules: { component: string; pattern: string }[];
    };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const schema = require("../packages/ai-context/src/schema/components.json") as {
      components: Record<string, { props?: Record<string, unknown> }>;
    };
    const declarative = /^(\w+)=("[^"]*"|\{[^}]*\}|\.\.\.)\s*$/;

    const misses: string[] = [];
    let covered = 0;
    for (const r of ap.rules) {
      const m = r.pattern.match(declarative);
      if (!m) continue;
      const prop = m[1];
      const compProps = schema.components[r.component]?.props ?? {};
      // Out of scope: prop IS declared, antiPattern guides value/signature.
      if (prop in compProps) continue;
      covered++;
      const snippet = `<${r.component} ${r.pattern} />`;
      const { issues } = validateSnippet(snippet);
      const triggered = issues.some(
        (i) => i.type === "hallucinated-prop" && i.prop === prop,
      );
      if (!triggered) {
        misses.push(
          `${r.component}: declarative antiPattern ${JSON.stringify(r.pattern)} no longer flags ${prop} as hallucinated`,
        );
      }
    }
    // Sanity: at least the canonical Button.color / Button.icon are covered.
    expect(covered).toBeGreaterThan(0);
    expect(misses, misses.join("\n")).toEqual([]);
  });
});

describe("validate-ai-context — source & reporting", () => {
  it("validateSource reports line numbers for offending tags", () => {
    const src = ["<div>", '  <Button color="red">x</Button>', "</div>"].join(
      "\n",
    );
    const results = validateSource(src, "demo.tsx");
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(2);
    expect(results[0].filename).toBe("demo.tsx");
  });

  it("formatResults counts errors and produces actionable output", () => {
    const results = validateSource(
      '<Button variant="blurple">x</Button>',
      "demo.tsx",
    );
    const { output, errorCount } = formatResults(results);
    expect(errorCount).toBe(1);
    expect(output).toMatch(/demo\.tsx:1/);
    expect(output).toMatch(/→/); // includes the fix hint
  });

  it("clean source yields zero results", () => {
    const results = validateSource(
      '<Button variant="primary">ok</Button>',
      "ok.tsx",
    );
    expect(results).toEqual([]);
  });
});
