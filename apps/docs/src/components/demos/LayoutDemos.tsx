import {
  Stack,
  Grid,
  GridItem,
  Box,
  Card,
  CardBody,
  Badge,
  Button,
  Avatar,
  Text,
  Heading,
  Tag,
} from "@usevyre/react";

/* ────────────────────────────────────────────────────────────
   Each demo below is kept BYTE-IDENTICAL to the `code*React`
   snippet on its docs page, so the live preview always matches
   the code the user copies.
   ──────────────────────────────────────────────────────────── */

// ── Stack ─────────────────────────────────────────────────────

export function StackBasicDemo() {
  return (
    <Stack width="full" direction="row" gap="md" align="center" justify="between">
      <Stack direction="row" gap="sm" align="center">
        <Avatar fallback="AL" />
        <Stack direction="column" gap="none">
          <Text>Ada Lovelace</Text>
          <Text size="sm" color="muted">Owner</Text>
        </Stack>
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </Stack>
    </Stack>
  );
}

export function StackColumnDemo() {
  return (
    <Stack direction="column" gap="sm">
      <Badge variant="success">Step 1</Badge>
      <Badge variant="success">Step 2</Badge>
      <Badge>Step 3</Badge>
    </Stack>
  );
}

export function StackWrapDemo() {
  return (
    <Stack wrap="wrap" rowGap="md" columnGap="sm">
      <Tag>react</Tag>
      <Tag>vue</Tag>
      <Tag>typescript</Tag>
      <Tag>design-systems</Tag>
      <Tag>accessibility</Tag>
      <Tag>tokens</Tag>
    </Stack>
  );
}

// ── Grid ──────────────────────────────────────────────────────

const stats = [
  { label: "Revenue", value: "$48.2k" },
  { label: "Users", value: "12,840" },
  { label: "Orders", value: "1,204" },
  { label: "Refunds", value: "32" },
  { label: "Churn", value: "2.1%" },
  { label: "MRR", value: "$9.6k" },
];

export function GridBasicDemo() {
  return (
    <Grid columns={3} gap="md">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardBody>
            <Text size="sm" color="muted">{s.label}</Text>
            <Heading size="lg">{s.value}</Heading>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

export function GridSpanDemo() {
  return (
    <Grid columns={3} gap="md">
      <GridItem colSpan={2}>
        <Card>
          <CardBody>
            <Heading size="sm">Main content</Heading>
            <Text color="muted">Spans 2 of 3 columns</Text>
          </CardBody>
        </Card>
      </GridItem>
      <Card>
        <CardBody>
          <Heading size="sm">Sidebar</Heading>
          <Text color="muted">1 column</Text>
        </CardBody>
      </Card>
      <Card>
        <CardBody><Text>Footer A</Text></CardBody>
      </Card>
      <Card>
        <CardBody><Text>Footer B</Text></CardBody>
      </Card>
      <Card>
        <CardBody><Text>Footer C</Text></CardBody>
      </Card>
    </Grid>
  );
}

export function GridAutoFitDemo() {
  return (
    <Grid columns="auto-fit" gap="md">
      {stats.slice(0, 4).map((s) => (
        <Card key={s.label}>
          <CardBody>
            <Text size="sm" color="muted">{s.label}</Text>
            <Heading size="lg">{s.value}</Heading>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

// ── Box ───────────────────────────────────────────────────────

export function BoxBasicDemo() {
  return (
    <Card>
      <Box padding="lg">
        <Text>padding="lg" on every side</Text>
      </Box>
    </Card>
  );
}

export function BoxAxisDemo() {
  return (
    <Card>
      <Box paddingX="xl" paddingY="sm">
        <Text>paddingX="xl" · paddingY="sm"</Text>
      </Box>
    </Card>
  );
}

export function BoxSideDemo() {
  return (
    <Stack direction="column" gap="none">
      <Card>
        <Box padding="md">First card</Box>
      </Card>
      <Box marginTop="lg">
        <Card>
          <Box padding="md">Pushed down with marginTop="lg"</Box>
        </Card>
      </Box>
    </Stack>
  );
}
