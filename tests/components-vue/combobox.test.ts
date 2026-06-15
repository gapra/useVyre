/**
 * Behavior contract — @usevyre/vue Combobox (portal + select-on-click).
 */
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { Combobox } from "../../packages/vue/src";

const OPTIONS = [
  { value: "ts", label: "TypeScript" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go" },
];

describe("Combobox (vue) — portal", () => {
  it("portals the open dropdown to document.body by default", async () => {
    const { container, getByRole } = render(Combobox, {
      props: { options: OPTIONS, modelValue: null },
    });
    await fireEvent.focus(getByRole("combobox"));

    const listbox = document.querySelector('[role="listbox"]')!;
    expect(listbox).toBeTruthy();
    expect(container.querySelector(".vyre-combobox")?.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it("renders inline inside the wrapper when disablePortal is set", async () => {
    const { container, getByRole } = render(Combobox, {
      props: { options: OPTIONS, modelValue: null, disablePortal: true },
    });
    await fireEvent.focus(getByRole("combobox"));

    const listbox = container.querySelector('[role="listbox"]')!;
    expect(listbox).toBeTruthy();
    expect(container.querySelector(".vyre-combobox")?.contains(listbox)).toBe(true);
  });

  it("selects an option clicked in the portaled dropdown", async () => {
    const { getByRole, getByText, emitted } = render(Combobox, {
      props: { options: OPTIONS, modelValue: null },
    });
    await fireEvent.focus(getByRole("combobox"));
    await fireEvent.mouseDown(getByText("Rust"));
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["rs"]);
  });
});
