// WITH useVyre context — documented variant + Box for spacing, no raw color.
import { Card, Box } from "@usevyre/react";

export function PricingCard() {
  return (
    <Card variant="elevated">
      <Box padding="lg">
        <h3>Pro</h3>
        <p>$29/mo</p>
      </Box>
    </Card>
  );
}
