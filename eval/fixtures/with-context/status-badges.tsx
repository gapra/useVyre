// WITH useVyre context — uses documented variants, Stack for layout.
import { Badge, Stack } from "@usevyre/react";

export function StatusBadges() {
  return (
    <Stack direction="row" gap="sm">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
    </Stack>
  );
}
