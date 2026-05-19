// WITHOUT useVyre context — invents an "error" variant + raw colors.
import { Badge } from "@usevyre/react";

export function StatusBadges() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error" style={{ backgroundColor: "#ef4444" }}>
        Failed
      </Badge>
    </div>
  );
}
