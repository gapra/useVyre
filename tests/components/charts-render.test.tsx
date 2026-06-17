import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { resolve } from "node:path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => { R = await import(resolve(process.cwd(), "packages/react/dist/index.js")); });

describe("Sparkline", () => {
  it("renders an svg with a path for line variant", () => {
    const { container } = render(<R.Sparkline data={[1, 5, 3, 8, 2]} variant="line" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("role")).toBe("img");
    expect(container.querySelectorAll("path").length).toBeGreaterThanOrEqual(1);
  });
  it("renders rects for bar variant (one per datum)", () => {
    const { container } = render(<R.Sparkline data={[1, 2, 3]} variant="bar" />);
    expect(container.querySelectorAll("rect").length).toBe(3);
  });
  it("renders a valid empty svg for empty data (no NaN)", () => {
    const { container } = render(<R.Sparkline data={[]} variant="bar" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(container.querySelectorAll("rect").length).toBe(0);
    // no NaN/Infinity leaked into any attribute
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });
});
