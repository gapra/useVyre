/**
 * Smoke tests — shallow but broad coverage.
 *
 * Each standalone component must mount without throwing and produce DOM. This is
 * deliberately simple (no deep behavior assertions) — it catches the "component
 * crashes on render" class of regression across many components that otherwise
 * had no test at all. Renders the BUILT @usevyre/react.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { resolve } from "node:path";

const ROOT = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

// Standalone components with minimal valid props. Sub-components that need a
// parent context (AccordionItem, CommandItem, …) are covered by their parents'
// behavior tests, not here.
function cases(): Array<[string, () => React.ReactElement]> {
  return [
    ["Skeleton", () => <R.Skeleton />],
    ["Separator", () => <R.Separator />],
    ["Heading", () => <R.Heading>Title</R.Heading>],
    ["Text", () => <R.Text>Body</R.Text>],
    ["Code", () => <R.Code>const x = 1</R.Code>],
    ["Lead", () => <R.Lead>Lead</R.Lead>],
    ["Blockquote", () => <R.Blockquote>Quote</R.Blockquote>],
    ["Label", () => <R.Label>Name</R.Label>],
    ["Textarea", () => <R.Textarea aria-label="notes" />],
    ["Tag", () => <R.Tag>tag</R.Tag>],
    ["EmptyState", () => <R.EmptyState title="Nothing here" />],
    ["Stat", () => <R.Stat label="Revenue" value="$1,200" />],
    ["Timeline", () => <R.Timeline items={[{ title: "Created" }]} />],
    ["Stack", () => <R.Stack><span>a</span></R.Stack>],
    ["Box", () => <R.Box>x</R.Box>],
    ["Grid", () => <R.Grid><span>a</span></R.Grid>],
    ["Stepper", () => <R.Stepper><R.Step>One</R.Step></R.Stepper>],
  ];
}

describe("component smoke — renders without crashing", () => {
  it.each(cases())("%s mounts and produces DOM", (_name, renderEl) => {
    const { container } = render(renderEl());
    expect(container.firstChild).toBeTruthy();
  });
});
