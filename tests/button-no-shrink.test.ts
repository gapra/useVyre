/**
 * Regression guard: a Button must not be shrunk below its label by a flex parent
 * (toolbar / modal footer / button row). With white-space:nowrap, shrinking spills
 * the text past the padding. We assert the base .vyre-btn rule sets
 * flex-shrink: 0. (jsdom has no layout, so the visual fit is verified in-browser;
 * this guards the rule that makes it work.)
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

for (const pkg of ["react", "vue"]) {
  describe(`@usevyre/${pkg} — Button does not flex-shrink`, () => {
    const css = readFileSync(
      resolve(ROOT, `packages/${pkg}/src/styles/components.css`),
      "utf8",
    );
    // the base .vyre-btn { … } rule (first one)
    const rule = css.match(/\.vyre-btn \{[\s\S]*?\}/)?.[0] ?? "";

    it("base .vyre-btn sets flex-shrink: 0", () => {
      expect(rule).toContain("flex-shrink: 0");
    });
  });
}
