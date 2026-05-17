/**
 * Example app — "Acme Billing" dashboard.
 *
 * A functional multi-page dashboard shell composed entirely from
 * @usevyre/react primitives. Each route renders <DashboardApp page="…">
 * which draws the shared sidebar/topbar shell + the active page.
 *
 * Routes: /examples/dashboard-app/{,/invoices,/customers,/reports,/settings}
 */
import { useState } from "react";
import {
  AppLayout,
  AppShell,
  AppBar,
  PageContent,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSection,
  SidebarItem,
  SidebarFooter,
  useAppLayout,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableCaption,
  Input,
  Field,
  FieldLabel,
  FieldGroup,
  RadioGroup,
  Switch,
  Progress,
} from "@usevyre/react";

type PageId = "overview" | "invoices" | "customers" | "reports" | "settings";

const BASE = "/examples/dashboard-app";

/* ── Icons (inline, zero-dep) ─────────────────────────────────── */
const ic = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const icons = {
  overview: ic("M3 12l9-9 9 9M5 10v10h14V10"),
  invoices: ic("M6 2h9l4 4v16H6zM14 2v5h5M9 13h6M9 17h6"),
  customers: ic("M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"),
  reports: ic("M4 19V5M4 19h16M8 16V9M13 16v-4M18 16V7"),
  settings: ic(
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.4 3a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 3h5l.4-3a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z"
  ),
};

// Distinct trigger icons: "close panel" when open, "open panel" when collapsed.
const PanelClose = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M10 4v16" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M16.5 9.5L14 12l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PanelOpen = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M10 4v16" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M14 9.5L16.5 12 14 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NAV: { id: PageId; label: string; href: string; badge?: string }[] = [
  { id: "overview", label: "Overview", href: `${BASE}/` },
  { id: "invoices", label: "Invoices", href: `${BASE}/invoices`, badge: "12" },
  { id: "customers", label: "Customers", href: `${BASE}/customers` },
  { id: "reports", label: "Reports", href: `${BASE}/reports` },
  { id: "settings", label: "Settings", href: `${BASE}/settings` },
];

const PAGE_TITLE: Record<PageId, string> = {
  overview: "Overview",
  invoices: "Invoices",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
};

/* Footer user — collapse-aware: only the avatar remains when collapsed. */
function SidebarUser() {
  const { collapsed } = useAppLayout();
  if (collapsed) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar fallback="GP" size="sm" status="online" />
      </div>
    );
  }
  return (
    <Item variant="plain" size="sm" style={{ padding: 0 }}>
      <ItemMedia>
        <Avatar fallback="GP" size="sm" status="online" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Galih Pranowo</ItemTitle>
        <ItemDescription>Owner</ItemDescription>
      </ItemContent>
    </Item>
  );
}

/* ── Shared shell ─────────────────────────────────────────────── */
function Shell({ page, children }: { page: PageId; children: React.ReactNode }) {
  return (
    <AppLayout>
      <Sidebar>
        <SidebarHeader
          logo={
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "var(--vyre-color-semantic-accent)",
                color: "var(--vyre-color-semantic-accent-foreground)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              A
            </span>
          }
          title="Acme Billing"
        />
        <SidebarContent>
          <SidebarSection>
            {NAV.map((n) => (
              <SidebarItem
                key={n.id}
                href={n.href}
                active={n.id === page}
                icon={icons[n.id]}
                badge={n.badge}
              >
                {n.label}
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser />
        </SidebarFooter>
      </Sidebar>

      <AppShell>
        <AppBar>
          <SidebarTrigger icon={PanelClose} collapsedIcon={PanelOpen} />
          <strong style={{ fontSize: 15 }}>{PAGE_TITLE[page]}</strong>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <Button variant="accent" size="sm">
              New invoice
            </Button>
          </div>
        </AppBar>
        <PageContent>
          <div style={{ maxWidth: 1040, padding: "0 4px" }}>
            {children}
          </div>
        </PageContent>
      </AppShell>
    </AppLayout>
  );
}

/* ── Page: Overview ───────────────────────────────────────────── */
const KPIS = [
  { label: "Revenue (MTD)", value: "$48,250", delta: "+12.4%", tone: "success" as const },
  { label: "Open invoices", value: "12", delta: "3 overdue", tone: "warning" as const },
  { label: "Outstanding", value: "$9,820", delta: "-4.1%", tone: "danger" as const },
  { label: "Collection rate", value: "92%", delta: "+2pts", tone: "success" as const },
];

function OverviewPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {KPIS.map((k) => (
          <Card key={k.label} variant="elevated">
            <CardBody>
              <div style={{ fontSize: 13, color: "var(--vyre-color-semantic-text-muted)" }}>
                {k.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, margin: "6px 0 4px" }}>
                {k.value}
              </div>
              <Badge variant={k.tone}>{k.delta}</Badge>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card variant="outlined">
        <CardHeader>
          <strong>Recent activity</strong>
        </CardHeader>
        <CardBody style={{ paddingTop: 0 }}>
          <ItemGroup separated>
            {[
              ["Invoice #1043 paid", "Globex Corp · $4,200", "2h ago"],
              ["New customer added", "Initech Ltd", "5h ago"],
              ["Invoice #1041 overdue", "Hooli · $1,800", "1d ago"],
              ["Payout sent", "$12,400 to bank ••• 4821", "2d ago"],
            ].map(([t, d, when]) => (
              <Item key={t}>
                <ItemContent>
                  <ItemTitle>{t}</ItemTitle>
                  <ItemDescription>{d}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--vyre-color-semantic-text-muted)",
                    }}
                  >
                    {when}
                  </span>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardBody>
      </Card>
    </div>
  );
}

/* ── Page: Invoices ───────────────────────────────────────────── */
interface InvoiceRow extends Record<string, unknown> {
  id: string;
  client: string;
  amount: number;
  status: string;
}
const INVOICES: InvoiceRow[] = [
  { id: "INV-1043", client: "Globex Corp", amount: 4200, status: "paid" },
  { id: "INV-1042", client: "Initech Ltd", amount: 2750, status: "pending" },
  { id: "INV-1041", client: "Hooli", amount: 1800, status: "overdue" },
  { id: "INV-1040", client: "Soylent", amount: 6100, status: "paid" },
  { id: "INV-1039", client: "Umbrella", amount: 980, status: "pending" },
  { id: "INV-1038", client: "Stark Industries", amount: 15400, status: "paid" },
  { id: "INV-1037", client: "Wayne Enterprises", amount: 3300, status: "overdue" },
];
const statusTone: Record<string, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
};

type SortKey = "id" | "client" | "amount";

function InvoicesPage() {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const dirFor = (key: SortKey) => (sortKey === key ? sortDir : null);

  const rows = INVOICES.filter(
    (r) =>
      r.client.toLowerCase().includes(q.toLowerCase()) ||
      r.id.toLowerCase().includes(q.toLowerCase())
  ).sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Card variant="outlined">
      <CardHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
          }}
        >
          <strong style={{ flex: 1 }}>All invoices</strong>
          <div style={{ width: 240 }}>
            <Input
              placeholder="Search client or ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Table hoverable>
          <TableCaption>
            Showing {rows.length} of {INVOICES.length} invoices
          </TableCaption>
          <TableHead>
            <TableRow>
              <TableHeader
                sortable
                sortDir={dirFor("id")}
                onSort={() => toggleSort("id")}
              >
                Invoice
              </TableHeader>
              <TableHeader
                sortable
                sortDir={dirFor("client")}
                onSort={() => toggleSort("client")}
              >
                Client
              </TableHeader>
              <TableHeader
                align="right"
                sortable
                sortDir={dirFor("amount")}
                onSort={() => toggleSort("amount")}
              >
                Amount
              </TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  style={{ color: "var(--vyre-color-semantic-text-muted)" }}
                >
                  No invoices match your search
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.client}</TableCell>
                  <TableCell align="right">
                    ${r.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusTone[r.status]}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}

/* ── Page: Customers ──────────────────────────────────────────── */
const CUSTOMERS = [
  { name: "Globex Corp", email: "billing@globex.com", plan: "Enterprise", mrr: "$4,200" },
  { name: "Initech Ltd", email: "ap@initech.com", plan: "Pro", mrr: "$750" },
  { name: "Hooli", email: "finance@hooli.xyz", plan: "Pro", mrr: "$750" },
  { name: "Soylent", email: "pay@soylent.co", plan: "Enterprise", mrr: "$6,100" },
  { name: "Umbrella", email: "accounts@umbrella.io", plan: "Starter", mrr: "$120" },
];

function CustomersPage() {
  return (
    <Card variant="outlined">
      <CardHeader>
        <strong>Customers</strong>
      </CardHeader>
      <CardBody style={{ paddingTop: 0 }}>
        <ItemGroup separated>
          {CUSTOMERS.map((c) => (
            <Item key={c.email} clickable>
              <ItemMedia>
                <Avatar
                  fallback={c.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                  size="sm"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{c.name}</ItemTitle>
                <ItemDescription>{c.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={c.plan === "Enterprise" ? "accent" : "default"}>
                  {c.plan}
                </Badge>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{c.mrr}/mo</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardBody>
    </Card>
  );
}

/* ── Page: Reports ────────────────────────────────────────────── */
function ReportsPage() {
  const goals = [
    { label: "Quarterly target", value: 78 },
    { label: "Invoices collected", value: 92 },
    { label: "Churn (lower is better)", value: 14 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {[
          ["Avg. invoice", "$3,940"],
          ["Days to pay", "11.2"],
          ["Active customers", "143"],
        ].map(([l, v]) => (
          <Card key={l} variant="elevated">
            <CardBody>
              <div style={{ fontSize: 13, color: "var(--vyre-color-semantic-text-muted)" }}>
                {l}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{v}</div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card variant="outlined">
        <CardHeader>
          <strong>Goals</strong>
        </CardHeader>
        <CardBody
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          {goals.map((g) => (
            <div key={g.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                <span>{g.label}</span>
                <span style={{ fontWeight: 600 }}>{g.value}%</span>
              </div>
              <Progress value={g.value} />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

/* ── Page: Settings ───────────────────────────────────────────── */
function SettingsPage() {
  const [form, setForm] = useState({
    company: "Acme Billing",
    email: "billing@acme.com",
    currency: "usd",
    weekly: true,
    overdue: true,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}>
      <Card variant="outlined">
        <CardHeader>
          <strong>Workspace</strong>
        </CardHeader>
        <CardBody style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <FieldGroup orientation="horizontal">
            <Field label="Company name">
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>
            <Field label="Billing email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Default currency</FieldLabel>
            <RadioGroup
              value={form.currency}
              onChange={(v) => set("currency", v)}
              orientation="horizontal"
              options={[
                { value: "usd", label: "USD" },
                { value: "eur", label: "EUR" },
                { value: "idr", label: "IDR" },
              ]}
            />
          </Field>
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardHeader>
          <strong>Notifications</strong>
        </CardHeader>
        <CardBody>
          <ItemGroup separated>
            <Item>
              <ItemContent>
                <ItemTitle>Weekly summary</ItemTitle>
                <ItemDescription>Every Monday at 9am</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={form.weekly}
                  onCheckedChange={(c) => set("weekly", c)}
                />
              </ItemActions>
            </Item>
            <Item>
              <ItemContent>
                <ItemTitle>Overdue alerts</ItemTitle>
                <ItemDescription>When an invoice passes due date</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  checked={form.overdue}
                  onCheckedChange={(c) => set("overdue", c)}
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardBody>
        <CardFooter>
          <Button variant="accent" size="sm">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/* ── Entry ────────────────────────────────────────────────────── */
const PAGES: Record<PageId, () => React.ReactElement> = {
  overview: OverviewPage,
  invoices: InvoicesPage,
  customers: CustomersPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

export function DashboardApp({ page }: { page: PageId }) {
  const Page = PAGES[page];
  return (
    <Shell page={page}>
      <Page />
    </Shell>
  );
}
