import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("chart-math react/vue parity", () => {
  it("vue chart-math is byte-identical to react", () => {
    const root = process.cwd();
    const a = readFileSync(resolve(root, "packages/react/src/utils/chart-math.ts"), "utf8");
    const b = readFileSync(resolve(root, "packages/vue/src/utils/chart-math.ts"), "utf8");
    expect(b).toBe(a);
  });
  it("vue chart-types is byte-identical to react", () => {
    const root = process.cwd();
    const a = readFileSync(resolve(root, "packages/react/src/components/Chart/chart-types.ts"), "utf8");
    const b = readFileSync(resolve(root, "packages/vue/src/components/Chart/chart-types.ts"), "utf8");
    expect(b).toBe(a);
  });
});
