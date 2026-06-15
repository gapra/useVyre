import {
  Card, CardBody, Field, Input, Button, Checkbox, Heading, Text, Stack,
  StatGroup, Stat, EmptyState, Grid, Badge, Switch,
} from "@usevyre/react";

/**
 * Live previews for the composition blocks shown on /docs/blocks. Each export
 * mirrors the copy-paste source in packages/ai-context/src/blocks/*.md.
 */

export function AuthCardBlock() {
  return (
    <Card variant="elevated" style={{ maxWidth: 420, margin: "0 auto" }}>
      <CardBody>
        <Stack direction="column" gap="md">
          <div>
            <Heading size="lg">Sign in</Heading>
            <Text variant="muted">Welcome back. Enter your details.</Text>
          </div>

          <Field label="Email">
            <Input type="email" placeholder="you@example.com" />
          </Field>

          <Field label="Password">
            <Input type="password" placeholder="••••••••" />
          </Field>

          <label style={{ display: "flex", alignItems: "center", gap: "var(--vyre-spacing-2)" }}>
            <Checkbox /> Remember me
          </label>

          <Button variant="accent" style={{ width: "100%" }}>Sign in</Button>

          <Stack direction="row" gap="sm">
            <Button variant="secondary" style={{ flex: 1 }}>GitHub</Button>
            <Button variant="secondary" style={{ flex: 1 }}>Google</Button>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}

export function StatsRowBlock() {
  return (
    <StatGroup>
      <Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
      <Stat label="Active users" value="2,340" delta={3.1} trend="up" />
      <Stat label="Churn" value="1.8%" delta={-0.4} trend="down" deltaLabel="lower is better" />
      <Stat label="Open tickets" value="17" delta={0} trend="neutral" />
    </StatGroup>
  );
}

export function EmptyStateBlock() {
  return (
    <EmptyState title="No projects yet" description="Create your first project to get started.">
      <Button variant="accent">New project</Button>
    </EmptyState>
  );
}

const plans = [
  { name: "Starter", price: "$0", features: ["1 project", "Community support"], featured: false },
  { name: "Pro", price: "$19", features: ["Unlimited projects", "Email support", "Analytics"], featured: true },
  { name: "Team", price: "$49", features: ["Everything in Pro", "SSO", "Audit log"], featured: false },
];

export function PricingSectionBlock() {
  return (
    <Grid columns={3} gap="lg">
      {plans.map((plan) => (
        <Card key={plan.name} variant={plan.featured ? "elevated" : "outlined"}>
          <CardBody>
            <Stack direction="column" gap="md">
              <Stack direction="row" gap="sm" align="center">
                <Heading size="md">{plan.name}</Heading>
                {plan.featured && <Badge variant="success">Popular</Badge>}
              </Stack>
              <Heading size="xl">{plan.price}<Text as="span" variant="muted"> /mo</Text></Heading>
              <Stack direction="column" gap="xs">{plan.features.map((f) => <Text key={f}>{f}</Text>)}</Stack>
              <Button variant={plan.featured ? "accent" : "secondary"} style={{ width: "100%" }}>
                Choose {plan.name}
              </Button>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

export function SettingsPanelBlock() {
  return (
    <Card variant="outlined" style={{ maxWidth: 560 }}>
      <CardBody>
        <Stack direction="column" gap="lg">
          <Heading size="lg">Settings</Heading>
          <Field label="Display name"><Input placeholder="Ada Lovelace" /></Field>
          <Field label="Email"><Input type="email" placeholder="ada@example.com" /></Field>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Email notifications</Text>
            <Switch />
          </label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Two-factor authentication</Text>
            <Switch />
          </label>
          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost">Cancel</Button>
            <Button variant="accent">Save changes</Button>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
