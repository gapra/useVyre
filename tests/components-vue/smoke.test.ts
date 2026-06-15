/**
 * Smoke tests (Vue) — shallow but broad. Each standalone component mounts
 * without throwing and produces DOM. Renders Vue SFCs from source.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import { h } from "vue";
import {
  Skeleton,
  Separator,
  Heading,
  Text,
  Code,
  Label,
  Textarea,
  Tag,
  EmptyState,
  Stat,
  Stack,
  Box,
} from "../../packages/vue/src";

const cases: Array<[string, () => unknown]> = [
  ["Skeleton", () => render(Skeleton)],
  ["Separator", () => render(Separator)],
  ["Heading", () => render(Heading, { slots: { default: () => "Title" } })],
  ["Text", () => render(Text, { slots: { default: () => "Body" } })],
  ["Code", () => render(Code, { slots: { default: () => "x" } })],
  ["Label", () => render(Label, { slots: { default: () => "Name" } })],
  ["Textarea", () => render(Textarea, { props: { "aria-label": "notes" } })],
  ["Tag", () => render(Tag, { slots: { default: () => "tag" } })],
  ["EmptyState", () => render(EmptyState, { props: { title: "Nothing" } })],
  ["Stat", () => render(Stat, { props: { label: "Rev", value: "$1" } })],
  ["Stack", () => render(Stack, { slots: { default: () => h("span", "a") } })],
  ["Box", () => render(Box, { slots: { default: () => "x" } })],
];

describe("component smoke (vue) — renders without crashing", () => {
  it.each(cases)("%s mounts and produces DOM", (_name, mount) => {
    const { container } = mount() as { container: HTMLElement };
    expect(container.firstChild).toBeTruthy();
  });
});
