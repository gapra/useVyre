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
