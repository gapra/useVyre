import { useState } from "react";
import { NumberInput, Stack, Text } from "@usevyre/react";

export function NumberInputDemo() {
  const [qty, setQty] = useState<number | null>(1);
  const [price, setPrice] = useState<number | null>(9.99);

  return (
    <Stack direction="column" gap="lg" style={{ width: "100%", maxWidth: 320 }}>
      <Stack direction="column" gap="xs">
        <Text size="sm" color="muted">Quantity (1–99, step 1)</Text>
        <NumberInput value={qty} onChange={setQty} min={1} max={99} />
      </Stack>
      <Stack direction="column" gap="xs">
        <Text size="sm" color="muted">Price (step 0.5, 2 decimals)</Text>
        <NumberInput
          value={price}
          onChange={setPrice}
          min={0}
          step={0.5}
          precision={2}
        />
      </Stack>
      <Text size="sm">
        Total: <strong>{((qty ?? 0) * (price ?? 0)).toFixed(2)}</strong>
      </Text>
    </Stack>
  );
}
