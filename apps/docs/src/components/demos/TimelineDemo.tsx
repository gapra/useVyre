import {
  Timeline,
  TimelineItem,
  Card,
  CardBody,
  Stack,
  Text,
  Badge,
} from "@usevyre/react";

export function TimelineDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 460 }}>
      <CardBody>
        <Timeline
          items={[
            { title: "Deployed v2.1.0", time: "2m ago", status: "success" },
            { title: "Build passed", time: "5m ago", status: "info" },
            { title: "Tests failed (retry)", time: "8m ago", status: "danger" },
            { title: "Pushed to main", time: "10m ago" },
          ]}
        />
      </CardBody>
    </Card>
  );
}

export function TimelineRichDemo() {
  return (
    <Card style={{ width: "100%", maxWidth: 460 }}>
      <CardBody>
        <Timeline>
          <TimelineItem title="Invoice paid" time="Apr 2" status="success">
            <Text size="sm" color="muted">
              $1,200 — Acme Inc.
            </Text>
          </TimelineItem>
          <TimelineItem title="Plan upgraded" time="Mar 28" status="info">
            <Stack direction="row" gap="sm" align="center">
              <Badge variant="default">Starter</Badge>
              <Text size="sm" color="muted">→</Text>
              <Badge variant="accent">Pro</Badge>
            </Stack>
          </TimelineItem>
          <TimelineItem title="Account created" time="Mar 1" />
        </Timeline>
      </CardBody>
    </Card>
  );
}
