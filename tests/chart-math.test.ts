import { describe, it, expect } from "vitest";
import { scaleLinear, niceTicks } from "../packages/react/src/utils/chart-math";

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

describe("niceTicks", () => {
  it("returns round, ascending ticks covering the range", () => {
    const ticks = niceTicks(0, 95, 5);
    expect(ticks[0]).toBeLessThanOrEqual(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(95);
    for (let i = 1; i < ticks.length; i++) expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
    const step = ticks[1] - ticks[0];
    expect([1,2,2.5,5,10,20,25,50,100,200,250,500,1000]).toContain(step);
  });
  it("handles a flat series (min === max) without NaN", () => {
    const ticks = niceTicks(10, 10, 5);
    expect(ticks.every((t) => Number.isFinite(t))).toBe(true);
    expect(ticks.length).toBeGreaterThanOrEqual(2);
  });
});
