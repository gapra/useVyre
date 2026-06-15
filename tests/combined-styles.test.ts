/**
 * Build-output contract: the shipped stylesheet must be self-contained —
 * design tokens (CSS variables) AND component styles in one file — so a single
 * `@usevyre/{react,vue}/styles` import fully styles the components. Guards
 * against a build change dropping the tokens half (which would render every
 * component unstyled, an invisible-until-runtime regression).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

function css(pkg: string): string {
  return readFileSync(
    resolve(ROOT, `packages/${pkg}/dist/styles/components.css`),
    "utf8",
  );
}

for (const pkg of ["react", "vue"]) {
  describe(`@usevyre/${pkg}/styles — self-contained`, () => {
    const content = css(pkg);

    it("includes the design tokens (CSS variables)", () => {
      expect(content).toMatch(/--vyre-color-/);
      // a :root block from the tokens file
      expect(content).toContain(":root");
    });

    it("includes component styles", () => {
      expect(content).toMatch(/\.vyre-(btn|badge|card)/);
    });
  });
}
