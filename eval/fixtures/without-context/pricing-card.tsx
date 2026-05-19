// WITHOUT useVyre context — invents `elevated`/`highlight` boolean props
// and a raw accent color instead of the accent variant.
import { Card } from "@usevyre/react";

export function PricingCard() {
  return (
    <Card
      elevated
      highlight
      style={{ border: "2px solid #f59e0b", padding: "24px" }}
    >
      <h3>Pro</h3>
      <p>$29/mo</p>
    </Card>
  );
}
