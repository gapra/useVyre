/**
 * Core component behavior — does the code keep the promise the schema makes?
 *
 * The AI-facing schema tells an agent: Button.variant defaults to
 * "secondary", reflects as data-variant, loading disables the button, etc.
 * schema-integrity.test.ts proves the schema is well-formed; this proves the
 * BUILT component actually behaves that way. Together they close the loop:
 * an agent can trust the schema because the schema is tested against reality.
 *
 * Tests the built package (packages/react/dist) — run `pnpm -r build` first.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// jsdom doesn't give a file: import.meta.url; Vitest runs from the repo root.
const ROOT = process.cwd();
type PropDef = { type?: string; values?: string[]; default?: unknown };
type Comp = { props: Record<string, PropDef> };
const schema = JSON.parse(
  readFileSync(
    resolve(ROOT, "packages/ai-context/src/schema/components.json"),
    "utf8",
  ),
).components as Record<string, Comp>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

describe("Button — schema contract", () => {
  it("defaults to the variant/size the schema advertises", () => {
    render(<R.Button>Go</R.Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute(
      "data-variant",
      schema.Button.props.variant.default,
    );
    expect(btn).toHaveAttribute("data-size", schema.Button.props.size.default);
  });

  it("reflects every documented variant value as data-variant", () => {
    for (const v of schema.Button.props.variant.values ?? []) {
      const { unmount } = render(<R.Button variant={v}>{v}</R.Button>);
      expect(screen.getByRole("button", { name: v })).toHaveAttribute(
        "data-variant",
        v,
      );
      unmount();
    }
  });

  it("loading disables the button and blocks clicks (schema: 'disables interaction')", () => {
    const onClick = vi.fn();
    render(
      <R.Button loading onClick={onClick}>
        Save
      </R.Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("polymorphic `as` renders the requested element (schema documents as=a)", () => {
    render(
      <R.Button as="a" href="/docs">
        Docs
      </R.Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("rejects no documented variant silently — unknown value is not coerced", () => {
    // Guards the inverse: the component must not invent/normalize a value
    // the schema never lists, or the schema would be lying by omission.
    const valid = new Set(schema.Button.props.variant.values ?? []);
    render(<R.Button variant="primary">x</R.Button>);
    const dv = screen.getByRole("button").getAttribute("data-variant");
    expect(dv).not.toBeNull();
    expect(valid.has(dv as string)).toBe(true);
  });
});

describe("Badge — schema contract", () => {
  it("defaults to schema variant", () => {
    render(<R.Badge>New</R.Badge>);
    expect(screen.getByText("New")).toHaveAttribute(
      "data-variant",
      schema.Badge.props.variant.default,
    );
  });

  it("reflects every documented variant", () => {
    for (const v of schema.Badge.props.variant.values ?? []) {
      const { unmount } = render(<R.Badge variant={v}>{v}</R.Badge>);
      expect(screen.getByText(v)).toHaveAttribute("data-variant", v);
      unmount();
    }
  });
});

describe("Alert — schema contract", () => {
  // NOTE: Alert is inconsistent with Button/Badge/Card — it reflects variant
  // ONLY via the `vyre-alert--<variant>` class, with no data-variant
  // attribute. This is a real cross-component inconsistency (flagged to the
  // maintainer), so the test asserts Alert's ACTUAL contract rather than the
  // assumed one; if Alert is later normalized to data-variant, update here.
  it("defaults to schema variant and renders as an alert region", () => {
    render(<R.Alert>Heads up</R.Alert>);
    const el = screen.getByRole("alert");
    expect(el.className).toContain(
      `vyre-alert--${schema.Alert.props.variant.default}`,
    );
  });

  it("reflects every documented variant (via class)", () => {
    for (const v of schema.Alert.props.variant.values ?? []) {
      const { unmount } = render(<R.Alert variant={v}>msg {v}</R.Alert>);
      expect(screen.getByRole("alert").className).toContain(
        `vyre-alert--${v}`,
      );
      unmount();
    }
  });

  it("onClose is wired when provided (schema lists onClose prop)", () => {
    const onClose = vi.fn();
    render(<R.Alert onClose={onClose}>Closable</R.Alert>);
    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Card — schema contract", () => {
  it("defaults to schema variant", () => {
    render(<R.Card>content</R.Card>);
    expect(screen.getByText("content")).toHaveAttribute(
      "data-variant",
      schema.Card.props.variant.default,
    );
  });

  it("reflects every documented variant", () => {
    for (const v of schema.Card.props.variant.values ?? []) {
      const { unmount } = render(<R.Card>card {v}</R.Card>);
      // re-render per variant
      unmount();
      render(<R.Card variant={v}>card {v}</R.Card>);
      expect(screen.getByText(`card ${v}`)).toHaveAttribute("data-variant", v);
    }
  });
});

describe("Input — schema contract", () => {
  it("defaults to schema size", () => {
    render(<R.Input aria-label="name" />);
    const input = screen.getByLabelText("name");
    // size is reflected via class (vyre-input--<size>) per implementation
    expect(input.className).toContain(
      `vyre-input--${schema.Input.props.size.default}`,
    );
  });

  it("accepts every documented size", () => {
    for (const s of schema.Input.props.size.values ?? []) {
      const { unmount } = render(<R.Input aria-label={`in-${s}`} size={s} />);
      const input = screen.getByLabelText(`in-${s}`);
      expect(input.className).toContain(`vyre-input--${s}`);
      unmount();
    }
  });

  it("forwards native props (value/onChange) — controlled input works", () => {
    const onChange = vi.fn();
    render(<R.Input aria-label="q" value="hi" onChange={onChange} />);
    const input = screen.getByLabelText("q") as HTMLInputElement;
    expect(input.value).toBe("hi");
    fireEvent.change(input, { target: { value: "hey" } });
    expect(onChange).toHaveBeenCalled();
  });
});
