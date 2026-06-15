/**
 * Behavior contract — @usevyre/vue Tooltip (portal + arrow).
 *
 * Tooltip shows on focusin (no hover delay). The trigger goes in the default
 * slot.
 */
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { h } from "vue";
import { Tooltip } from "../../packages/vue/src";

function renderTooltip(props: Record<string, unknown> = {}) {
  return render(Tooltip, {
    props: { content: "Copy to clipboard", ...props },
    slots: { default: () => h("button", "Copy") },
  });
}

describe("Tooltip (vue) — portal", () => {
  it("portals the tooltip to document.body by default", async () => {
    const { container, getByText } = renderTooltip();
    await fireEvent.focusIn(getByText("Copy"));

    const tip = document.querySelector('[role="tooltip"]')!;
    expect(tip).toBeTruthy();
    expect(container.querySelector(".vyre-tooltip-wrapper")?.contains(tip)).toBe(false);
    expect(document.body.contains(tip)).toBe(true);
  });

  it("renders inline inside the wrapper when disablePortal is set", async () => {
    const { container, getByText } = renderTooltip({ disablePortal: true });
    await fireEvent.focusIn(getByText("Copy"));

    const tip = container.querySelector('[role="tooltip"]')!;
    expect(tip).toBeTruthy();
    expect(container.querySelector(".vyre-tooltip-wrapper")?.contains(tip)).toBe(true);
  });

  it("keeps the arrow and placement class when portaled", async () => {
    const { getByText } = renderTooltip();
    await fireEvent.focusIn(getByText("Copy"));

    const tip = document.querySelector('[role="tooltip"]')!;
    expect(tip.querySelector(".vyre-tooltip__arrow")).toBeTruthy();
    expect(tip.className).toContain("vyre-tooltip--top");
  });
});
