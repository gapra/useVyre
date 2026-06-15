/**
 * Behavior contract — @usevyre/vue Select.
 *
 * First tests in the Vue harness: guards the portal + keyboard fixes shipped
 * this cycle, which previously had NO automated Vue coverage. Renders the Vue
 * SFC directly from source via @vitejs/plugin-vue.
 */
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { Select } from "../../packages/vue/src";

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

function highlightedLabel() {
  return document
    .querySelector('[role="option"][data-highlighted="true"]')
    ?.textContent?.trim();
}

describe("Select (vue) — portal", () => {
  it("portals the open dropdown to document.body by default", async () => {
    const { container, getByRole } = render(Select, {
      props: { options: OPTIONS, modelValue: "" },
    });
    await fireEvent.click(getByRole("button"));

    const listbox = document.querySelector('[role="listbox"]')!;
    expect(listbox).toBeTruthy();
    expect(container.querySelector(".vyre-select")?.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it("renders inline inside the wrapper when disablePortal is set", async () => {
    const { container, getByRole } = render(Select, {
      props: { options: OPTIONS, modelValue: "", disablePortal: true },
    });
    await fireEvent.click(getByRole("button"));

    const listbox = container.querySelector('[role="listbox"]')!;
    expect(listbox).toBeTruthy();
    expect(container.querySelector(".vyre-select")?.contains(listbox)).toBe(true);
  });
});

describe("Select (vue) — keyboard navigation", () => {
  it("navigates with ArrowDown and selects with Enter (focus stays on trigger)", async () => {
    const { getByRole, emitted } = render(Select, {
      props: { options: OPTIONS, modelValue: "" },
    });
    const trigger = getByRole("button");

    await fireEvent.keyDown(trigger, { key: "ArrowDown" }); // open, highlight React
    expect(document.querySelector('[role="listbox"]')).toBeTruthy();
    expect(highlightedLabel()).toBe("React");

    await fireEvent.keyDown(trigger, { key: "ArrowDown" }); // -> Vue
    expect(highlightedLabel()).toBe("Vue");

    await fireEvent.keyDown(trigger, { key: "Enter" });
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["vue"]);
  });
});
