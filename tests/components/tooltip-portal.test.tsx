/**
 * Behavior contract — Tooltip portal (same overlay-clip class as Combobox #18).
 *
 * The tooltip rendered inline with position:absolute, so a Modal's
 * overflow:hidden clipped it. Fix: portal to <body> by default, positioned via
 * JS against the trigger rect; a `disablePortal` prop restores inline rendering.
 *
 * Renders the BUILT @usevyre/react, matching the rest of the components suite.
 * Focusing the trigger shows the tooltip immediately (no hover delay).
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

describe("Tooltip — portal", () => {
  it("portals the tooltip to document.body by default", () => {
    const { container } = render(
      <R.Tooltip content="Copy to clipboard">
        <button>Copy</button>
      </R.Tooltip>,
    );
    fireEvent.focus(screen.getByText("Copy"));

    const tip = screen.getByRole("tooltip");
    expect(container.querySelector(".vyre-tooltip-wrapper")?.contains(tip)).toBe(
      false,
    );
    expect(document.body.contains(tip)).toBe(true);
  });

  it("renders the tooltip inline inside the wrapper when disablePortal is set", () => {
    const { container } = render(
      <R.Tooltip content="Copy to clipboard" disablePortal>
        <button>Copy</button>
      </R.Tooltip>,
    );
    fireEvent.focus(screen.getByText("Copy"));

    const tip = screen.getByRole("tooltip");
    expect(container.querySelector(".vyre-tooltip-wrapper")?.contains(tip)).toBe(
      true,
    );
  });

  it("keeps the arrow when portaled", () => {
    render(
      <R.Tooltip content="Copy to clipboard">
        <button>Copy</button>
      </R.Tooltip>,
    );
    fireEvent.focus(screen.getByText("Copy"));

    const tip = screen.getByRole("tooltip");
    expect(tip.querySelector(".vyre-tooltip__arrow")).toBeTruthy();
    // placement class is preserved so the arrow positions correctly
    expect(tip.className).toContain("vyre-tooltip--top");
  });
});
