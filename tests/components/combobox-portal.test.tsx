/**
 * Behavior contract — Combobox dropdown portal (issue #18).
 *
 * Bug: the Combobox dropdown rendered inline inside the component wrapper, so
 * when placed inside a Modal (overflow: hidden) the options were clipped.
 *
 * Fix: the dropdown portals to document.body by default and is positioned
 * against the input rect. A `disablePortal` prop restores inline rendering.
 *
 * These tests render the BUILT @usevyre/react, matching the rest of the
 * components suite. Rebuild the react package before running.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { resolve } from "node:path";

const ROOT = process.cwd();

const OPTIONS = [
  { value: "ts", label: "TypeScript" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

describe("Combobox — dropdown portal (issue #18)", () => {
  it("portals the open dropdown to document.body by default", () => {
    const { container } = render(
      <R.Combobox options={OPTIONS} value={null} onChange={() => {}} />,
    );
    fireEvent.focus(screen.getByRole("combobox"));

    const listbox = screen.getByRole("listbox");
    // Dropdown must NOT live inside the component wrapper — that's what gets
    // clipped by a Modal's overflow:hidden.
    expect(container.querySelector(".vyre-combobox")?.contains(listbox)).toBe(
      false,
    );
    // It must be attached to body (portaled).
    expect(document.body.contains(listbox)).toBe(true);
  });

  it("renders the dropdown inline inside the wrapper when disablePortal is set", () => {
    const { container } = render(
      <R.Combobox
        options={OPTIONS}
        value={null}
        onChange={() => {}}
        disablePortal
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));

    const listbox = screen.getByRole("listbox");
    expect(container.querySelector(".vyre-combobox")?.contains(listbox)).toBe(
      true,
    );
  });

  it("still selects an option clicked in the portaled dropdown", () => {
    const onChange = vi.fn();
    render(<R.Combobox options={OPTIONS} value={null} onChange={onChange} />);
    fireEvent.focus(screen.getByRole("combobox"));

    fireEvent.mouseDown(screen.getByText("Rust"));
    expect(onChange).toHaveBeenCalledWith("rs");
  });

  it("does not scroll the page when opened (portaled option must not call scrollIntoView)", () => {
    const spy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    try {
      render(<R.Combobox options={OPTIONS} value="rs" onChange={() => {}} />);
      fireEvent.focus(screen.getByRole("combobox"));
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
