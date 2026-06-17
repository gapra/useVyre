import { describe, it, expect } from "vitest";
import { scaleLinear } from "../packages/react/src/utils/chart-math";

describe("scaleLinear", () => {
  it("maps domain start to range start and domain end to range end", () => {
    const s = scaleLinear([0, 100], [0, 200]);
    expect(s(0)).toBe(0);
    expect(s(100)).toBe(200);
    expect(s(50)).toBe(100);
  });
  it("handles inverted range (SVG y-axis grows downward)", () => {
    const s = scaleLinear([0, 10], [300, 0]);
    expect(s(0)).toBe(300);
    expect(s(10)).toBe(0);
    expect(s(5)).toBe(150);
  });
  it("does not divide by zero when domain is a single point", () => {
    const s = scaleLinear([5, 5], [0, 100]);
    expect(Number.isFinite(s(5))).toBe(true);
  });
});
