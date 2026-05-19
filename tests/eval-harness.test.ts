/**
 * The eval harness measures correctness, so the harness itself must be
 * proven correct — otherwise the headline number is just an assertion.
 *
 * These tests pin: (a) the scorer detects the documented failure modes,
 * (b) correct useVyre code scores exactly zero (no false positives — a
 * scorer that flags valid code would inflate the "reduction"), and (c) the
 * corpus stays paired so the comparison is apples-to-apples.
 */
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
// @ts-expect-error — plain JS harness, no types needed for this assertion.
import { runEval } from "../eval/scorer.js";

const ROOT = process.cwd();
const FIX = resolve(ROOT, "eval/fixtures");

describe("eval harness — corpus integrity", () => {
  it("with/without arms are paired (same fixture ids)", () => {
    const a = readdirSync(resolve(FIX, "without-context")).sort();
    const b = readdirSync(resolve(FIX, "with-context")).sort();
    expect(b).toEqual(a);
  });
});

describe("eval harness — scorer correctness", () => {
  const r = runEval();

  it("flags real issues in the without-context arm", () => {
    expect(r.without.totalIssues).toBeGreaterThan(0);
  });

  it("does NOT flag the with-context arm (no false positives)", () => {
    // If this fails, either useVyre's documented API is wrong in a fixture
    // or the validator over-reports — both are real bugs worth surfacing.
    expect(r.with.totalIssues).toBe(0);
  });

  it("context produces a strictly positive issue reduction", () => {
    expect(r.with.totalIssues).toBeLessThan(r.without.totalIssues);
    expect(r.reduction).toBeGreaterThan(0);
  });

  it("breaks issues down into the three measured categories", () => {
    const w = r.without;
    expect(
      w.hallucinatedProps + w.invalidEnums + w.rawColors,
    ).toBe(w.totalIssues);
  });
});
