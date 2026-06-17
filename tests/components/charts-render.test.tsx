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

describe("LineChart", () => {
  const data = [
    { month: "Jan", revenue: 10, users: 5 },
    { month: "Feb", revenue: 20, users: 8 },
    { month: "Mar", revenue: 15, users: 12 },
  ];
  const config = {
    revenue: { label: "Revenue", color: "var(--vyre-color-semantic-accent)" },
    users: { label: "Users", color: "var(--vyre-color-semantic-teal)" },
  };
  it("renders an accessible svg with one line path per series", () => {
    const { container } = render(<R.LineChart data={data} config={config} xKey="month" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBeTruthy();
    // one <path> per series (2). (Grid lines are <line>, not <path>.)
    expect(container.querySelectorAll("path.vyre-chart__line, path[data-series]").length).toBe(2);
  });
  it("renders a legend item per series when showLegend", () => {
    const { container } = render(<R.LineChart data={data} config={config} xKey="month" showLegend />);
    expect(container.querySelectorAll(".vyre-chart__legend-item").length).toBe(2);
  });
  it("omits the grid when showGrid is false", () => {
    const { container } = render(<R.LineChart data={data} config={config} xKey="month" showGrid={false} />);
    expect(container.querySelectorAll(".vyre-chart__grid").length).toBe(0);
  });
});
