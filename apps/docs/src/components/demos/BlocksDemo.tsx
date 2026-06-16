import { useState } from "react";
import {
  Card, CardBody, Field, Input, Button, Checkbox, Heading, Text, Stack,
  StatGroup, Stat, EmptyState, Grid, Badge, Switch,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator,
  Modal, ModalHeader, ModalBody, ModalFooter,
  ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, Avatar,
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Pagination,
  Form, FormField,
  AppLayout, Sidebar, SidebarHeader, SidebarContent, SidebarSection, SidebarItem,
  SidebarFooter, AppShell, AppBar, SidebarTrigger, PageContent,
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
            <Text color="muted">Welcome back. Enter your details.</Text>
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
    <Card style={{ width: "100%" }}>
      <CardBody>
        <StatGroup>
          <Stat label="Revenue" value="$48,200" delta={12.5} trend="up" deltaLabel="vs last month" />
          <Stat label="Active users" value="2,340" delta={3.1} trend="up" />
          <Stat label="Churn" value="1.8%" delta={-0.4} trend="down" deltaLabel="lower is better" />
        </StatGroup>
      </CardBody>
    </Card>
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
              <Heading size="xl">{plan.price}<Text as="span" color="muted"> /mo</Text></Heading>
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

export function PageHeaderBlock() {
  return (
    <Stack direction="column" gap="sm" style={{ width: "100%" }}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem aria-current="page">Projects</BreadcrumbItem>
      </Breadcrumb>
      <Stack direction="row" align="center" justify="between">
        <Heading size="xl">Projects</Heading>
        <Stack direction="row" gap="sm">
          <Button variant="secondary">Export</Button>
          <Button variant="accent">New project</Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ConfirmDialogBlock() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <ModalHeader>Delete project?</ModalHeader>
        <ModalBody>This permanently removes the project and all its data. This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

const members = [
  { name: "Ada Lovelace", email: "ada@example.com", initials: "AL" },
  { name: "Alan Turing", email: "alan@example.com", initials: "AT" },
  { name: "Grace Hopper", email: "grace@example.com", initials: "GH" },
];

export function ItemListBlock() {
  return (
    <Card style={{ width: "100%" }}>
      <CardBody>
        <ItemGroup>
          {members.map((m) => (
            <Item key={m.email}>
              <ItemMedia><Avatar fallback={m.initials} size="sm" /></ItemMedia>
              <ItemContent>
                <ItemTitle>{m.name}</ItemTitle>
                <ItemDescription>{m.email}</ItemDescription>
              </ItemContent>
              <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardBody>
    </Card>
  );
}

const tableRows = [
  { name: "Acme Inc", plan: "Pro", status: "Active" },
  { name: "Globex", plan: "Starter", status: "Trial" },
  { name: "Initech", plan: "Business", status: "Active" },
];

export function DataTablePageBlock() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  return (
    <Stack direction="column" gap="md" style={{ width: "100%" }}>
      <Stack direction="row" align="center" justify="between">
        <Heading size="lg">Customers</Heading>
        <Stack direction="row" gap="sm">
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="accent">Add customer</Button>
        </Stack>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Plan</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((r) => (
            <TableRow key={r.name}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.plan}</TableCell>
              <TableCell>
                <Badge variant={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={5} onPageChange={setPage} />
    </Stack>
  );
}

export function FormPageBlock() {
  const [values, setValues] = useState({ name: "", email: "", role: "" });
  return (
    <Card style={{ width: "100%", maxWidth: 480 }}>
      <CardBody>
        <Stack direction="column" gap="lg">
          <Heading size="lg">New member</Heading>
          <Form values={values} onChange={(v) => setValues(v as typeof values)} onSubmit={() => {}}>
            <FormField name="name" label="Full name" rules={{ required: true }}>
              <Input placeholder="Ada Lovelace" />
            </FormField>
            <FormField name="email" label="Email" rules={{ required: true, email: true }}>
              <Input type="email" placeholder="ada@example.com" />
            </FormField>
            <FormField name="role" label="Role">
              <Input placeholder="Engineer" />
            </FormField>
            <Stack direction="row" gap="sm" justify="end">
              <Button variant="ghost" type="button">Cancel</Button>
              <Button variant="accent" type="submit">Create</Button>
            </Stack>
          </Form>
        </Stack>
      </CardBody>
    </Card>
  );
}

export function AppShellBlock() {
  return (
    <div style={{ height: 300, width: "100%", border: "1px solid var(--vyre-color-semantic-border)", borderRadius: "var(--vyre-border-radius-lg)", overflow: "hidden" }}>
      <AppLayout>
        <Sidebar>
          <SidebarHeader title="Acme" />
          <SidebarContent>
            <SidebarSection>
              <SidebarItem href="#" active>Dashboard</SidebarItem>
              <SidebarItem href="#">Customers</SidebarItem>
              <SidebarItem href="#" badge={3}>Billing</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem href="#">Settings</SidebarItem>
          </SidebarFooter>
        </Sidebar>
        <AppShell>
          <AppBar>
            <SidebarTrigger />
            <Heading size="md">Dashboard</Heading>
          </AppBar>
          <PageContent>
            <Text color="muted">Your page content goes here.</Text>
          </PageContent>
        </AppShell>
      </AppLayout>
    </div>
  );
}
