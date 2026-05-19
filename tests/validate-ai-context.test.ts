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
