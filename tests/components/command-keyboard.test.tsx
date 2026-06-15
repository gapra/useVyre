/**
 * Behavior contract — Command keyboard navigation (React).
 *
 * Bug: the keyboard handler was attached only to CommandList (a div that never
 * receives focus). Focus lives on CommandInput, which is a SIBLING of the list,
 * so keydown events never reached the handler and Arrow/Enter did nothing. The
 * Vue Command already handles keys on the input; this brings React to parity.
 *
 * Renders the BUILT @usevyre/react, matching the rest of the components suite.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { resolve } from "node:path";

const ROOT = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

function renderPalette(onSelectB: () => void) {
  return render(
    <R.Command>
      <R.CommandInput placeholder="Search..." />
      <R.CommandList>
        <R.CommandItem onSelect={() => {}}>Alpha</R.CommandItem>
        <R.CommandItem onSelect={onSelectB}>Bravo</R.CommandItem>
        <R.CommandItem onSelect={() => {}}>Charlie</R.CommandItem>
      </R.CommandList>
    </R.Command>,
  );
}

describe("Command — keyboard navigation (React)", () => {
  it("ArrowDown + Enter on the focused input selects the second item", () => {
    const onSelectB = vi.fn();
    renderPalette(onSelectB);

    const input = screen.getByPlaceholderText("Search...");
    input.focus();

    // activeIndex starts at 0 (Alpha). One ArrowDown -> Bravo. Enter selects it.
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelectB).toHaveBeenCalledTimes(1);
  });

  it("reflects the active item via aria-selected so it is visibly highlighted", () => {
    renderPalette(() => {});
    const input = screen.getByPlaceholderText("Search...");
    input.focus();

    const options = () => screen.getAllByRole("option");
    // First option active by default.
    expect(options()[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    const opts = options();
    expect(opts[0]).not.toHaveAttribute("aria-selected", "true");
    expect(opts[1]).toHaveAttribute("aria-selected", "true");
  });
});
