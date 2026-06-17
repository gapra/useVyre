/**
 * Chart render tests (Vue) — mirrors the React chart render suite.
 * Renders the @usevyre/vue chart SFCs from SOURCE via @vitejs/plugin-vue
 * (jsdom). Assertions are structural: element COUNTS + attributes only —
 * jsdom does not lay out SVG, so we never assert pixel geometry.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Sparkline,
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
} from "../../packages/vue/src";

const hasNoBadNumbers = (html: string) =>
  !/NaN|Infinity/.test(html);

describe("Sparkline", () => {
  it("line variant renders an svg with a path and role=img", () => {
    const w = mount(Sparkline, { props: { data: [1, 2, 3, 4] } });
    const svg = w.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("role")).toBe("img");
    expect(w.findAll("path")).toHaveLength(1);
    expect(w.findAll("rect")).toHaveLength(0);
  });

  it("bar variant renders one rect per datum", () => {
    const w = mount(Sparkline, { props: { data: [5, 3, 8], variant: "bar" } });
    expect(w.findAll("rect")).toHaveLength(3);
    expect(w.findAll("path")).toHaveLength(0);
  });

  it("area variant renders a path", () => {
    const w = mount(Sparkline, { props: { data: [1, 2, 3], variant: "area" } });
    expect(w.findAll("path")).toHaveLength(1);
  });

  it("empty data renders no NaN and zero rects/paths", () => {
    const w = mount(Sparkline, { props: { data: [] } });
    expect(w.find("svg").exists()).toBe(true);
    expect(w.find("svg").attributes("aria-label")).toBe("Sparkline, no data");
    expect(w.findAll("rect")).toHaveLength(0);
    expect(w.findAll("path")).toHaveLength(0);
    expect(hasNoBadNumbers(w.html())).toBe(true);
  });
});

const lineData = [
  { month: "Jan", revenue: 10, cost: 4 },
  { month: "Feb", revenue: 20, cost: 8 },
  { month: "Mar", revenue: 15, cost: 6 },
];
const twoSeriesConfig = {
  revenue: { label: "Revenue", color: "var(--vyre-color-semantic-accent)" },
  cost: { label: "Cost", color: "var(--vyre-color-semantic-teal)" },
};

describe("LineChart", () => {
  it("renders an svg role=img with one line path per series", () => {
    const w = mount(LineChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    const svg = w.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("role")).toBe("img");
    expect(w.findAll("path.vyre-chart__line")).toHaveLength(2);
  });

  it("renders one legend item per series", () => {
    const w = mount(LineChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    expect(w.findAll(".vyre-chart__legend-item")).toHaveLength(2);
  });

  it("omits the grid when showGrid=false", () => {
    const w = mount(LineChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month", showGrid: false },
    });
    expect(w.findAll(".vyre-chart__grid")).toHaveLength(0);
  });

  it("empty data renders no NaN", () => {
    const w = mount(LineChart, {
      props: { data: [], config: twoSeriesConfig, xKey: "month" },
    });
    expect(hasNoBadNumbers(w.html())).toBe(true);
  });
});

describe("AreaChart", () => {
  it("renders one area path per series", () => {
    const w = mount(AreaChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    expect(w.findAll("path.vyre-chart__area")).toHaveLength(2);
  });

  it("renders >=2 linearGradient defs by default (gradient=true)", () => {
    const w = mount(AreaChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    expect(w.findAll("linearGradient").length).toBeGreaterThanOrEqual(2);
  });

  it("renders 0 linearGradient when gradient=false", () => {
    const w = mount(AreaChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month", gradient: false },
    });
    expect(w.findAll("linearGradient")).toHaveLength(0);
  });

  it("empty data renders no NaN", () => {
    const w = mount(AreaChart, {
      props: { data: [], config: twoSeriesConfig, xKey: "month" },
    });
    expect(hasNoBadNumbers(w.html())).toBe(true);
  });
});

describe("BarChart", () => {
  it("grouped: renders one rect per series per datum (3x2 = 6 bars)", () => {
    const w = mount(BarChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    expect(w.findAll("rect.vyre-chart__bar")).toHaveLength(6);
  });

  it("renders one legend item per series", () => {
    const w = mount(BarChart, {
      props: { data: lineData, config: twoSeriesConfig, xKey: "month" },
    });
    expect(w.findAll(".vyre-chart__legend-item")).toHaveLength(2);
  });

  it("empty data renders no NaN", () => {
    const w = mount(BarChart, {
      props: { data: [], config: twoSeriesConfig, xKey: "month" },
    });
    expect(hasNoBadNumbers(w.html())).toBe(true);
  });
});

const pieData = [
  { name: "Chrome", value: 60 },
  { name: "Safari", value: 25 },
  { name: "Firefox", value: 15 },
];

describe("PieChart", () => {
  it("renders one slice path per datum", () => {
    const w = mount(PieChart, { props: { data: pieData } });
    const svg = w.find("svg");
    expect(svg.attributes("role")).toBe("img");
    expect(w.findAll("path.vyre-chart__slice")).toHaveLength(3);
  });

  it("renders one legend item per datum", () => {
    const w = mount(PieChart, { props: { data: pieData } });
    expect(w.findAll(".vyre-chart__legend-item")).toHaveLength(3);
  });

  it("empty data renders no NaN and zero slices", () => {
    const w = mount(PieChart, { props: { data: [] } });
    expect(w.findAll("path.vyre-chart__slice")).toHaveLength(0);
    expect(hasNoBadNumbers(w.html())).toBe(true);
  });
});
