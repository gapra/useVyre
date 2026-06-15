/**
 * Behavior contract — Select dropdown portal (same class of bug as Combobox #18).
 *
 * The Select dropdown rendered inline inside the component wrapper, so a Modal's
 * overflow:hidden clipped options below the modal edge. Fix mirrors Combobox:
 * portal to <body> by default, positioned against the trigger rect; a
 * `disablePortal` prop restores inline rendering.
 *
 * Renders the BUILT @usevyre/react, matching the rest of the components suite.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { resolve } from "node:path";

const ROOT = process.cwd();

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

function openSelect() {
  // The trigger is the button with aria-haspopup="listbox".
  fireEvent.click(screen.getByRole("button"));
}

describe("Select — dropdown portal", () => {
  it("portals the open dropdown to document.body by default", () => {
    const { container } = render(
      <R.Select options={OPTIONS} value="" onChange={() => {}} />,
    );
    openSelect();

    const listbox = screen.getByRole("listbox");
    expect(container.querySelector(".vyre-select")?.contains(listbox)).toBe(
      false,
    );
    expect(document.body.contains(listbox)).toBe(true);
  });

  it("renders the dropdown inline inside the wrapper when disablePortal is set", () => {
    const { container } = render(
      <R.Select options={OPTIONS} value="" onChange={() => {}} disablePortal />,
    );
    openSelect();

    const listbox = screen.getByRole("listbox");
    expect(container.querySelector(".vyre-select")?.contains(listbox)).toBe(
      true,
    );
  });

  it("still selects an option clicked in the portaled dropdown", () => {
    const onChange = vi.fn();
    render(<R.Select options={OPTIONS} value="" onChange={onChange} />);
    openSelect();

    fireEvent.mouseDown(screen.getByText("Vue"));
    expect(onChange).toHaveBeenCalledWith("vue");
  });

  it("does not scroll the page when opened (portaled option must not call scrollIntoView)", () => {
    // Root cause of the docs page-jump: the 'scroll highlighted option into
    // view' effect called option.scrollIntoView(), which — now that the option
    // is portaled to <body> — scrolls the whole document. The dropdown must
    // scroll its own container instead, never the page.
    const spy = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    try {
      render(
        <R.Select options={OPTIONS} value="vue" onChange={() => {}} />,
      );
      openSelect();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});

describe("Select — keyboard navigation", () => {
  function highlightedLabel() {
    const hi = document.querySelector('[role="option"][data-highlighted="true"]');
    return hi?.textContent?.trim() ?? null;
  }

  it("navigates options with ArrowDown while focus stays on the trigger", () => {
    render(<R.Select options={OPTIONS} value="" onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    trigger.focus();

    // ArrowDown opens and highlights the first option.
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(highlightedLabel()).toBe("React");

    // ArrowDown again must advance the highlight (the bug: it didn't move
    // because the handler lived on the never-focused <ul>).
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(highlightedLabel()).toBe("Vue");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(highlightedLabel()).toBe("Svelte");
  });

  it("selects the highlighted option with Enter", () => {
    const onChange = vi.fn();
    render(<R.Select options={OPTIONS} value="" onChange={onChange} />);
    const trigger = screen.getByRole("button");
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // open, highlight React
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // -> Vue
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("vue");
  });
});
