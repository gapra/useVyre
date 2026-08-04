/**
 * Regression guards for two layout bugs that consumers had to patch downstream
 * with global CSS overrides (karokulo-lancar PR #16):
 *
 *  1. NumberInput overflowed narrow grid columns / mobile. The root was
 *     inline-flex with no width, so it shrink-to-fit the native input's ~170px
 *     preferred width plus both steppers. The field also needs min-width:0 —
 *     a flex item never shrinks below its content size without it.
 *
 *  2. size="icon" buttons rendered the glyph off-centre: children go into
 *     .vyre-btn__label { flex: 1 }, which stretches, and SVG baseline
 *     alignment then nudges the icon down.
 *
 * jsdom has no layout engine, so we assert the CSS rules that make the layout
 * work — same approach as button-no-shrink.test.ts.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const ruleFor = (css: string, selector: string) => {
  // match `selector {` only when it starts a rule (not as part of a longer one)
  const re = new RegExp(
    `(^|\\})\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{[\\s\\S]*?\\}`,
    "m",
  );
  return css.match(re)?.[0] ?? "";
};

for (const pkg of ["react", "vue"]) {
  const css = readFileSync(
    resolve(ROOT, `packages/${pkg}/src/styles/components.css`),
    "utf8",
  );

  describe(`@usevyre/${pkg} — NumberInput fills its container`, () => {
    const root = ruleFor(css, ".vyre-number-input");
    const field = ruleFor(css, ".vyre-number-input__field");

    it("root is a full-width flex row, not inline-flex", () => {
      expect(root).toContain("display: flex");
      expect(root).not.toContain("display: inline-flex");
      expect(root).toContain("width: 100%");
    });

    it("field can shrink below its intrinsic width", () => {
      expect(field).toContain("min-width: 0");
    });
  });

  describe(`@usevyre/${pkg} — icon button centres its glyph`, () => {
    const label = ruleFor(css, ".vyre-btn--icon .vyre-btn__label");

    it("icon-button label shrink-wraps instead of stretching", () => {
      expect(label).toContain("flex: none");
      expect(label).toContain("align-items: center");
      expect(label).toContain("justify-content: center");
    });

    it("icon SVG is taken out of baseline flow", () => {
      expect(css).toMatch(/\.vyre-btn--icon svg\s*\{[^}]*display:\s*block/);
    });
  });
}
