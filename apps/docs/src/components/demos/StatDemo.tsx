import { Stat, StatGroup, Card, CardBody, Stack } from "@usevyre/react";

export function StatDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <CardBody>
        <StatGroup>
          <Stat
            label="Revenue"
            value="$48.2k"
            delta="+12%"
            trend="up"
            deltaLabel="+ → up → green"
          />
          <Stat
            label="Refunds"
            value="312"
            delta="-18%"
            trend="down"
            deltaLabel="− → down → red"
          />
          <Stat
            label="Orders"
            value="1,204"
            delta="0%"
            trend="neutral"
            deltaLabel="0 → flat → grey"
          />
        </StatGroup>
      </CardBody>
    </Card>
  );
}

export function StatDecoupledDemo() {
  return (
    <Stack direction="row" gap="md" style={{ width: "100%", maxWidth: 560 }}>
      <Card style={{ flex: 1 }}>
        <CardBody>
          <Stat
            label="Churn"
            value="2.1%"
            delta="-0.4%"
            trend="up"
            deltaLabel="down arrow, green (good)"
          />
        </CardBody>
      </Card>
      <Card style={{ flex: 1 }}>
        <CardBody>
          <Stat
            label="Error rate"
            value="1.8%"
            delta="+0.3%"
            trend="down"
            deltaLabel="up arrow, red (bad)"
          />
        </CardBody>
      </Card>
    </Stack>
  );
}
