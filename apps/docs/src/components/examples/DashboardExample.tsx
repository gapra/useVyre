import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@usevyre/react";

interface InvoiceRow {
  id:      string;
  client:  string;
  amount:  string;
  status:  "paid" | "pending" | "overdue";
  date:    string;
}

const invoices: InvoiceRow[] = [
  { id: "INV-1042", client: "GP Corp",     amount: "$4,200.00", status: "paid",    date: "Apr 28" },
  { id: "INV-1041", client: "Globex Ltd",    amount: "$1,860.00", status: "pending", date: "Apr 27" },
  { id: "INV-1040", client: "Initech",       amount: "$3,500.00", status: "paid",    date: "Apr 26" },
  { id: "INV-1039", client: "Hooli",         amount: "$  720.00", status: "overdue", date: "Apr 24" },
  { id: "INV-1038", client: "Stark Industry",amount: "$9,900.00", status: "paid",    date: "Apr 22" },
];

const statusVariant = {
  paid:    "success" as const,
  pending: "warning" as const,
  overdue: "danger"  as const,
};

export function DashboardExample() {
  const [search, setSearch] = useState("");
  const filtered = invoices.filter((row) =>
    row.client.toLowerCase().includes(search.toLowerCase()) ||
    row.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vyre-example-frame">
      {/* App bar */}
      <header className="vyre-example-frame__bar">
        <div className="vyre-example-frame__brand">
          <span className="vyre-example-frame__logo" aria-hidden="true" />
          <strong>Acme Billing</strong>
        </div>
        <div className="vyre-example-frame__bar-actions">
          <Button variant="ghost" size="sm">Help</Button>
          <Avatar fallback="GP" size="sm" status="online" />
        </div>
      </header>

      <div className="vyre-example-frame__body">
        {/* Sidebar */}
        <aside className="vyre-example-frame__side">
          <nav aria-label="Primary">
            <ul className="vyre-example-frame__nav">
              <li><a className="vyre-example-frame__nav-link vyre-example-frame__nav-link--active" href="#">Overview</a></li>
              <li><a className="vyre-example-frame__nav-link" href="#">Invoices</a></li>
              <li><a className="vyre-example-frame__nav-link" href="#">Customers</a></li>
              <li><a className="vyre-example-frame__nav-link" href="#">Reports</a></li>
              <li><a className="vyre-example-frame__nav-link" href="#">Settings</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="vyre-example-frame__main">
          <div className="vyre-example-frame__heading">
            <div>
              <h1 className="vyre-example-frame__title">Overview</h1>
              <p className="vyre-example-frame__lead">Last 30 days · all activity</p>
            </div>
            <Button variant="accent">+ New invoice</Button>
          </div>

          {/* KPI cards */}
          <div className="vyre-example-frame__kpis">
            <Card variant="elevated">
              <CardBody>
                <p className="vyre-example-frame__kpi-label">Revenue</p>
                <p className="vyre-example-frame__kpi-value">$48,290</p>
                <Badge variant="success" dot>+12.4%</Badge>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <p className="vyre-example-frame__kpi-label">Invoices</p>
                <p className="vyre-example-frame__kpi-value">142</p>
                <Badge variant="accent" dot>+8 this week</Badge>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <p className="vyre-example-frame__kpi-label">Outstanding</p>
                <p className="vyre-example-frame__kpi-value">$6,180</p>
                <Badge variant="warning" dot>3 overdue</Badge>
              </CardBody>
            </Card>
            <Card variant="elevated">
              <CardBody>
                <p className="vyre-example-frame__kpi-label">Collection rate</p>
                <p className="vyre-example-frame__kpi-value">94%</p>
                <Progress value={94} variant="success" size="sm" />
              </CardBody>
            </Card>
          </div>

          {/* Invoice table card */}
          <Card variant="outlined" style={{ marginTop: 24 }}>
            <CardHeader>
              <div className="vyre-example-frame__card-head">
                <div>
                  <h2 className="vyre-example-frame__card-title">Recent invoices</h2>
                  <p className="vyre-example-frame__card-sub">Search by client or invoice ID</p>
                </div>
                <div style={{ minWidth: 240 }}>
                  <Field>
                    <Input
                      placeholder="Search invoices…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardBody style={{ padding: 0 }}>
              <Table hoverable>
                <TableCaption>Showing {filtered.length} of {invoices.length} invoices</TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHeader>Invoice</TableHeader>
                    <TableHeader>Client</TableHeader>
                    <TableHeader align="right">Amount</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader align="right">Date</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell><code style={{ fontSize: 13 }}>{row.id}</code></TableCell>
                      <TableCell>{row.client}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]} dot>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </main>
      </div>
    </div>
  );
}
