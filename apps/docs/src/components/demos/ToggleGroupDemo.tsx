import { useState } from "react";
import { ToggleGroup, ToggleItem, Stack, Text } from "@usevyre/react";

export function ToggleGroupDemo() {
  const [view, setView] = useState<string | null>("grid");
  const [fmt, setFmt] = useState<string[]>(["bold"]);

  return (
    <Stack direction="column" gap="lg" style={{ width: "100%", maxWidth: 360 }}>
      <Stack direction="column" gap="xs">
        <Text size="sm" color="muted">Single — view ({view ?? "none"})</Text>
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "board", label: "Board" },
          ]}
        />
      </Stack>
      <Stack direction="column" gap="xs">
        <Text size="sm" color="muted">Multiple — format ({fmt.join(", ") || "none"})</Text>
        <ToggleGroup type="multiple" value={fmt} onChange={setFmt}>
          <ToggleItem value="bold">B</ToggleItem>
          <ToggleItem value="italic">I</ToggleItem>
          <ToggleItem value="underline">U</ToggleItem>
        </ToggleGroup>
      </Stack>
    </Stack>
  );
}
