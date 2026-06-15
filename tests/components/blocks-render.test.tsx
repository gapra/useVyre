/**
 * Block validity guard — the most important blocks test.
 *
 * Each composition block must actually compile and render with the SHIPPED
 * components and props. A broken block (hallucinated prop, removed component) is
 * worse than no block, so we render each block's composition against the built
 * @usevyre/react and assert it mounts. These compositions mirror the copy-paste
 * source in packages/ai-context/src/blocks/*.md.
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

describe("blocks render against shipped components", () => {
  it("AuthCard mounts", () => {
    const { container } = render(
      <R.Card variant="elevated" style={{ maxWidth: 420, margin: "0 auto" }}>
        <R.CardBody>
          <R.Stack gap="4">
            <div>
              <R.Heading size="lg">Sign in</R.Heading>
              <R.Text variant="muted">Welcome back.</R.Text>
            </div>
            <R.Field label="Email">
              <R.Input type="email" placeholder="you@example.com" />
            </R.Field>
            <R.Field label="Password">
              <R.Input type="password" placeholder="••••••••" />
            </R.Field>
            <label><R.Checkbox /> Remember me</label>
            <R.Button variant="accent" style={{ width: "100%" }}>Sign in</R.Button>
            <R.Stack direction="row" gap="2">
              <R.Button variant="secondary" style={{ flex: 1 }}>GitHub</R.Button>
              <R.Button variant="secondary" style={{ flex: 1 }}>Google</R.Button>
            </R.Stack>
          </R.Stack>
        </R.CardBody>
      </R.Card>,
    );
    expect(container.querySelector(".vyre-card")).toBeTruthy();
    // 2 text inputs (email, password) + 1 checkbox input
    expect(container.querySelectorAll("input").length).toBe(3);
    // every export referenced must exist (catches a removed/renamed component)
    for (const name of ["Card", "CardBody", "Field", "Input", "Button", "Checkbox", "Heading", "Text", "Stack"]) {
      expect(R[name], `missing export: ${name}`).toBeTruthy();
    }
  });

  it("StatsRow mounts", () => {
    const { container } = render(
      <R.StatGroup>
        <R.Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
        <R.Stat label="Active users" value="2,340" delta={3.1} trend="up" />
        <R.Stat label="Churn" value="1.8%" delta={-0.4} trend="down" deltaLabel="lower is better" />
        <R.Stat label="Open tickets" value="17" delta={0} trend="neutral" />
      </R.StatGroup>,
    );
    expect(container.textContent).toContain("Revenue");
    expect(container.textContent).toContain("$48,200");
  });

  it("EmptyStateBlock mounts", () => {
    const { container } = render(
      <R.EmptyState title="No projects yet" description="Create your first project to get started.">
        <R.Button variant="accent">New project</R.Button>
      </R.EmptyState>,
    );
    expect(container.textContent).toContain("No projects yet");
    expect(container.querySelector("button")).toBeTruthy();
  });

  it("PricingSection mounts", () => {
    const plans = [
      { name: "Starter", price: "$0", features: ["1 project"], featured: false },
      { name: "Pro", price: "$19", features: ["Unlimited projects"], featured: true },
    ];
    const { container } = render(
      <R.Grid columns={3} gap="lg">
        {plans.map((plan) => (
          <R.Card key={plan.name} variant={plan.featured ? "elevated" : "outlined"}>
            <R.CardBody>
              <R.Stack gap="md">
                <R.Stack direction="row" gap="sm" align="center">
                  <R.Heading size="md">{plan.name}</R.Heading>
                  {plan.featured && <R.Badge variant="success">Popular</R.Badge>}
                </R.Stack>
                <R.Heading size="xl">{plan.price}<R.Text as="span" variant="muted"> /mo</R.Text></R.Heading>
                <R.Stack gap="xs">{plan.features.map((f) => <R.Text key={f}>{f}</R.Text>)}</R.Stack>
                <R.Button variant={plan.featured ? "accent" : "secondary"} style={{ width: "100%" }}>
                  Choose {plan.name}
                </R.Button>
              </R.Stack>
            </R.CardBody>
          </R.Card>
        ))}
      </R.Grid>,
    );
    expect(container.textContent).toContain("Pro");
    expect(container.textContent).toContain("Popular");
  });

  it("SettingsPanel mounts", () => {
    const { container } = render(
      <R.Card variant="outlined" style={{ maxWidth: 560 }}>
        <R.CardBody>
          <R.Stack gap="lg">
            <R.Heading size="lg">Settings</R.Heading>
            <R.Field label="Display name"><R.Input placeholder="Ada Lovelace" /></R.Field>
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
  });
});
