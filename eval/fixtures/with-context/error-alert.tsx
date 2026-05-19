// WITH useVyre context — uses the documented danger variant.
import { Alert } from "@usevyre/react";

export function PaymentFailedAlert() {
  return (
    <Alert variant="danger" title="Payment failed">
      Your card was declined. Please try another payment method.
    </Alert>
  );
}
