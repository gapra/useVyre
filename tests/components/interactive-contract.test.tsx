/**
 * Behavior contract — batch 2: interactive components.
 *
 * Same goal as core-contract.test.tsx: prove the BUILT component does what
 * the schema promises an agent. This batch surfaced a real, dangerous
 * schema↔code drift that no other safety net caught:
 *
 *   The schema USED TO advertise `Switch.onChange` / `Checkbox.onChange`
 *   while the components only accept `onCheckedChange`. An agent following
 *   the schema wrote <Switch onChange={fn}>, the handler silently never
 *   fired, and validate-ai-context couldn't catch it.
 *
 *   FIXED in schema v1.16.1 (see DESIGN.md §3 "Known issue #2"). The tests
 *   below are now forward regression guards: they assert the schema keeps
 *   advertising the CORRECT prop, so a future edit can't reintroduce the
 *   lie unnoticed.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
// Every component referenced here is asserted to exist by
// schema-component-sync.test.ts, so a non-optional props map is safe and
// keeps the assertions readable (schema.X.props.size.default).
type PropDef = {
  type?: string;
  values?: string[];
  default?: unknown;
};
type Comp = { props: Record<string, PropDef> };
const schema = (
  JSON.parse(
    readFileSync(
      resolve(ROOT, "packages/ai-context/src/schema/components.json"),
      "utf8",
    ),
  ).components as Record<string, Comp>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

describe("Switch — schema contract (drift fixed v1.16.1)", () => {
  it("renders role=switch with documented default size via data-size", () => {
    render(<R.Switch />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("data-size", schema.Switch.props.size.default);
  });

  it("toggles via onCheckedChange (the REAL callback)", () => {
    const onCheckedChange = vi.fn();
    render(<R.Switch onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("FIXED: schema advertises onCheckedChange, not the old onChange lie", () => {
    // Forward regression guard for the v1.16.1 drift fix: the schema must
    // expose the prop the component actually has, and must NOT reintroduce
    // the bogus `onChange`. If either flips, this fails immediately.
    expect(schema.Switch.props).toHaveProperty("onCheckedChange");
    expect(schema.Switch.props).not.toHaveProperty("onChange");
  });

  it("respects disabled (no toggle, schema default false)", () => {
    const onCheckedChange = vi.fn();
    render(<R.Switch disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

describe("Checkbox — schema contract (drift fixed v1.16.1)", () => {
  it("renders a checkbox input at the documented default size (class)", () => {
    const { container } = render(<R.Checkbox aria-label="agree" />);
    const input = screen.getByRole("checkbox");
    expect(input).toHaveProperty("type", "checkbox");
    expect(
      container.querySelector(
        `.vyre-checkbox--${schema.Checkbox.props.size.default}`,
      ),
    ).toBeTruthy();
  });

  it("toggles via onCheckedChange (real callback), not onChange", () => {
    const onCheckedChange = vi.fn();
    render(<R.Checkbox aria-label="a" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("FIXED: schema advertises onCheckedChange, not the old onChange lie", () => {
    expect(schema.Checkbox.props).toHaveProperty("onCheckedChange");
    expect(schema.Checkbox.props).not.toHaveProperty("onChange");
  });
});

describe("Select — schema contract", () => {
  const opts = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana" },
  ];

  it("uses the documented default size (class)", () => {
    const { container } = render(<R.Select options={opts} />);
    expect(
      container.querySelector(
        `.vyre-select--${schema.Select.props.size.default}`,
      ),
    ).toBeTruthy();
  });

  it("shows placeholder when no value selected", () => {
    render(<R.Select options={opts} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeTruthy();
  });

  it("opens a listbox on trigger click (documented options behavior)", () => {
    render(<R.Select options={opts} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});

describe("Tooltip — schema contract", () => {
  // NOTE: mouseEnter is delayed by `delay` (schema default 300ms); focus
  // shows instantly. Using focus keeps the test deterministic without fake
  // timers while still exercising the documented show path.
  it("reflects the documented default placement via class when shown", () => {
    render(
      <R.Tooltip content="Hi">
        <button>hover me</button>
      </R.Tooltip>,
    );
    fireEvent.focus(screen.getByRole("button", { name: "hover me" }));
    const tip = screen.getByRole("tooltip");
    expect(tip.className).toContain(
      `vyre-tooltip--${schema.Tooltip.props.placement.default}`,
    );
    // Bonus: Tooltip IS consistent — it also emits data-placement.
    expect(tip).toHaveAttribute(
      "data-placement",
      schema.Tooltip.props.placement.default,
    );
  });

  it("accepts every documented placement", () => {
    for (const p of schema.Tooltip.props.placement.values ?? []) {
      const { unmount } = render(
        <R.Tooltip content="x" placement={p}>
          <button>t-{p}</button>
        </R.Tooltip>,
      );
      fireEvent.focus(screen.getByRole("button", { name: `t-${p}` }));
      expect(screen.getByRole("tooltip").className).toContain(
        `vyre-tooltip--${p}`,
      );
      unmount();
    }
  });

  it("does not show instantly on hover (mouse path is delayed by `delay`)", () => {
    // Asserts the documented delay behavior at the contract level — hover is
    // NOT immediate — without coupling to internal timer mechanics (fragile
    // under jsdom fake timers). The instant-show path is covered via focus.
    render(
      <R.Tooltip content="Hi" delay={300}>
        <button>hov</button>
      </R.Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "hov" }));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

describe("Avatar — schema contract", () => {
  it("reflects the documented default size via data-size", () => {
    const { container } = render(<R.Avatar alt="Jane" />);
    expect(container.querySelector("[data-size]")).toHaveAttribute(
      "data-size",
      schema.Avatar.props.size.default,
    );
  });

  it("exposes status via aria-label when provided", () => {
    render(<R.Avatar alt="Jane" status="online" />);
    expect(screen.getByLabelText("online")).toBeTruthy();
  });
});

describe("Progress — schema contract", () => {
  it("is a progressbar with documented default size and aria-valuenow", () => {
    render(<R.Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-size", schema.Progress.props.size.default);
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("indeterminate drops aria-valuenow (schema lists indeterminate)", () => {
    render(<R.Progress indeterminate />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });
});
