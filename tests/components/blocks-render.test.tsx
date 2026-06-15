/**
 * Block validity guard — the most important blocks test.
 *
 * Each composition block must compile, render with the SHIPPED components/props,
 * AND lay out as intended. jsdom has no layout engine, but useVyre's Stack
 * reflects its axis via `data-direction`, so we assert vertical stacks are
 * column — that catches the "everything renders in a row" class of bug that a
 * plain mount check misses. These mirror the copy-paste source in
 * packages/ai-context/src/blocks/*.md and the demos in BlocksDemo.tsx.
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

// Stack defaults to direction="row" in useVyre, so vertical layouts MUST pass
// direction="column" explicitly. This helper asserts no vertical stack was left
// at the default row.
function expectVerticalStacks(container: HTMLElement) {
  const stacks = [...container.querySelectorAll(".vyre-stack")];
  // every stack in these blocks is intentionally column EXCEPT ones we tag row
  const rows = stacks.filter((s) => s.getAttribute("data-direction") === "row");
  const cols = stacks.filter((s) => s.getAttribute("data-direction") === "column");
  return { stacks, rows, cols };
}

describe("blocks render + lay out correctly", () => {
  it("AuthCard: vertical stack is column, button row is row", () => {
    const { container } = render(
      <R.Card variant="elevated" style={{ maxWidth: 420, margin: "0 auto" }}>
        <R.CardBody>
          <R.Stack direction="column" gap="md">
            <div>
              <R.Heading size="lg">Sign in</R.Heading>
              <R.Text variant="muted">Welcome back.</R.Text>
            </div>
            <R.Field label="Email"><R.Input type="email" /></R.Field>
            <R.Field label="Password"><R.Input type="password" /></R.Field>
            <label><R.Checkbox /> Remember me</label>
            <R.Button variant="accent" style={{ width: "100%" }}>Sign in</R.Button>
            <R.Stack direction="row" gap="sm">
              <R.Button variant="secondary">GitHub</R.Button>
              <R.Button variant="secondary">Google</R.Button>
            </R.Stack>
          </R.Stack>
        </R.CardBody>
      </R.Card>,
    );
    expect(container.querySelector(".vyre-card")).toBeTruthy();
    expect(container.querySelectorAll("input").length).toBe(3);
    const { cols, rows } = expectVerticalStacks(container);
    expect(cols.length).toBe(1); // the outer vertical stack
    expect(rows.length).toBe(1); // the GitHub/Google row
  });

  it("StatsRow mounts (StatGroup inside a full-width Card)", () => {
    const { container } = render(
      <R.Card style={{ width: "100%" }}>
        <R.CardBody>
          <R.StatGroup>
            <R.Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
            <R.Stat label="Active users" value="2,340" delta={3.1} trend="up" />
          </R.StatGroup>
        </R.CardBody>
      </R.Card>,
    );
    expect(container.querySelector(".vyre-card")).toBeTruthy();
    expect(container.textContent).toContain("$48,200");
  });

  it("EmptyStateBlock mounts", () => {
    const { container } = render(
      <R.EmptyState title="No projects yet" description="Create your first project.">
        <R.Button variant="accent">New project</R.Button>
      </R.EmptyState>,
    );
    expect(container.textContent).toContain("No projects yet");
    expect(container.querySelector("button")).toBeTruthy();
  });

  it("PricingSection: each plan card stacks vertically", () => {
    const plans = [
      { name: "Starter", price: "$0", featured: false },
      { name: "Pro", price: "$19", featured: true },
    ];
    const { container } = render(
      <R.Grid columns={3} gap="lg">
        {plans.map((plan) => (
          <R.Card key={plan.name} variant={plan.featured ? "elevated" : "outlined"}>
            <R.CardBody>
              <R.Stack direction="column" gap="md">
                <R.Stack direction="row" gap="sm" align="center">
                  <R.Heading size="md">{plan.name}</R.Heading>
                  {plan.featured && <R.Badge variant="success">Popular</R.Badge>}
                </R.Stack>
                <R.Heading size="xl">{plan.price}</R.Heading>
                <R.Button variant={plan.featured ? "accent" : "secondary"}>Choose</R.Button>
              </R.Stack>
            </R.CardBody>
          </R.Card>
        ))}
      </R.Grid>,
    );
    expect(container.textContent).toContain("Popular");
    const cols = [...container.querySelectorAll('.vyre-stack[data-direction="column"]')];
    expect(cols.length).toBe(2); // one vertical stack per plan card
  });

  it("SettingsPanel: outer stack is column", () => {
    const { container } = render(
      <R.Card variant="outlined" style={{ maxWidth: 560 }}>
        <R.CardBody>
          <R.Stack direction="column" gap="lg">
            <R.Heading size="lg">Settings</R.Heading>
            <R.Field label="Display name"><R.Input /></R.Field>
            <label style={{ display: "flex", justifyContent: "space-between" }}>
              <R.Text>Email notifications</R.Text>
              <R.Switch />
            </label>
            <R.Stack direction="row" gap="sm" justify="end">
              <R.Button variant="ghost">Cancel</R.Button>
              <R.Button variant="accent">Save changes</R.Button>
            </R.Stack>
          </R.Stack>
        </R.CardBody>
      </R.Card>,
    );
    expect(container.textContent).toContain("Settings");
    expect(container.querySelector('[role="switch"]')).toBeTruthy();
    expect(container.querySelector('.vyre-stack[data-direction="column"]')).toBeTruthy();
  });
});
