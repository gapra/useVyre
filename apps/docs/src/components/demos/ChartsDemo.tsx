import {
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  Sparkline,
  Stat,
  Card,
  CardBody,
} from "@usevyre/react";

/* ---- shared sample data --------------------------------------------- */

const monthly = [
  { month: "Jan", revenue: 18, users: 12 },
  { month: "Feb", revenue: 22, users: 15 },
  { month: "Mar", revenue: 20, users: 17 },
  { month: "Apr", revenue: 28, users: 21 },
  { month: "May", revenue: 34, users: 26 },
  { month: "Jun", revenue: 31, users: 29 },
  { month: "Jul", revenue: 40, users: 33 },
  { month: "Aug", revenue: 46, users: 38 },
];

const seriesConfig = {
  revenue: { label: "Revenue", color: "var(--vyre-color-semantic-accent)" },
  users:   { label: "Users",   color: "var(--vyre-color-semantic-teal)" },
};

const regions = [
  { region: "NA",   sales: 38, returns: 6 },
  { region: "EU",   sales: 31, returns: 5 },
  { region: "APAC", sales: 27, returns: 4 },
  { region: "LATAM", sales: 14, returns: 3 },
];

const regionConfig = {
  sales:   { label: "Sales",   color: "var(--vyre-color-semantic-accent)" },
  returns: { label: "Returns", color: "var(--vyre-color-semantic-warning)" },
};

const browsers = [
  { name: "Chrome",  value: 62 },
  { name: "Safari",  value: 19 },
  { name: "Firefox", value: 9 },
  { name: "Edge",    value: 7 },
  { name: "Other",   value: 3 },
];

const browserConfig = {
  Chrome:  { label: "Chrome",  color: "var(--vyre-color-semantic-accent)" },
  Safari:  { label: "Safari",  color: "var(--vyre-color-semantic-teal)" },
  Firefox: { label: "Firefox", color: "var(--vyre-color-semantic-warning)" },
  Edge:    { label: "Edge",    color: "var(--vyre-color-semantic-success)" },
  Other:   { label: "Other",  color: "var(--vyre-color-semantic-danger)" },
};

/* ---- LineChart ------------------------------------------------------- */

export function LineChartDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <CardBody>
        <LineChart
          data={monthly}
          config={seriesConfig}
          xKey="month"
          curve="smooth"
          dots
          width={500}
          height={260}
        />
      </CardBody>
    </Card>
  );
}

/* ---- AreaChart ------------------------------------------------------- */

export function AreaChartDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <CardBody>
        <AreaChart
          data={monthly}
          config={seriesConfig}
          xKey="month"
          curve="smooth"
          stacked
          width={500}
          height={260}
        />
      </CardBody>
    </Card>
  );
}

/* ---- BarChart -------------------------------------------------------- */

export function BarChartDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <CardBody>
        <BarChart
          data={regions}
          config={regionConfig}
          xKey="region"
          width={500}
          height={260}
        />
      </CardBody>
    </Card>
  );
}

/* ---- PieChart -------------------------------------------------------- */

export function PieChartDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <CardBody>
        <PieChart
          data={browsers}
          config={browserConfig}
          donut
          size={260}
        />
      </CardBody>
    </Card>
  );
}

/* ---- Sparkline ------------------------------------------------------- */

export function SparklineDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 360 }}>
      <CardBody>
        <Stat
          label="Revenue"
          value="$48.2k"
          delta="+12%"
          trend="up"
          deltaLabel="last 8 months"
          icon={
            <Sparkline
              data={[18, 22, 20, 28, 34, 31, 40, 46]}
              color="var(--vyre-color-semantic-success)"
              width={96}
              height={28}
            />
          }
        />
      </CardBody>
    </Card>
  );
}

export function SparklineVariantsDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 360 }}>
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Sparkline
            data={[3, 7, 4, 9, 6, 11, 8, 12]}
            variant="line"
            color="var(--vyre-color-semantic-accent)"
          />
          <Sparkline
            data={[3, 7, 4, 9, 6, 11, 8, 12]}
            variant="area"
            color="var(--vyre-color-semantic-teal)"
          />
          <Sparkline
            data={[3, 7, 4, 9, 6, 11, 8, 12]}
            variant="bar"
            color="var(--vyre-color-semantic-success)"
          />
        </div>
      </CardBody>
    </Card>
  );
}
