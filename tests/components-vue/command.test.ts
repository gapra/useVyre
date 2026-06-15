/**
 * Behavior contract — @usevyre/vue Command (keyboard nav + active highlight).
 *
 * Vue Command attaches keydown to the input (always focused), so nav works; the
 * active item must reflect aria-selected so it is visibly highlighted.
 */
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { h } from "vue";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "../../packages/vue/src";

function renderPalette(onSelectB: () => void) {
  return render({
    components: { Command, CommandInput, CommandList, CommandItem },
    setup() {
      return () =>
        h(Command, null, {
          default: () => [
            h(CommandInput, { placeholder: "Search..." }),
            h(CommandList, null, {
              default: () => [
                h(CommandItem, null, { default: () => "Alpha" }),
                h(CommandItem, { onSelect: onSelectB }, { default: () => "Bravo" }),
                h(CommandItem, null, { default: () => "Charlie" }),
              ],
            }),
          ],
        });
    },
  });
}

function activeLabel() {
  return document
    .querySelector('[role="option"][aria-selected="true"]')
    ?.textContent?.trim();
}

describe("Command (vue) — keyboard navigation", () => {
  it("highlights the active item via aria-selected and moves with ArrowDown", async () => {
    const { getByPlaceholderText } = renderPalette(() => {});
    const input = getByPlaceholderText("Search...");

    // ArrowDown from the initial index (0 = Alpha) moves to Bravo, which must be
    // reflected via aria-selected so it is visibly highlighted.
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(activeLabel()).toBe("Bravo");

    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(activeLabel()).toBe("Charlie");
  });

  it("selects the active item with Enter", async () => {
    let selected = false;
    const { getByPlaceholderText } = renderPalette(() => { selected = true; });
    const input = getByPlaceholderText("Search...");

    await fireEvent.keyDown(input, { key: "ArrowDown" }); // -> Bravo
    await fireEvent.keyDown(input, { key: "Enter" });
    expect(selected).toBe(true);
  });
});
