// WITHOUT useVyre context — "error" variant doesn't exist (it's "danger").
import { Alert } from "@usevyre/react";

export function PaymentFailedAlert() {
  return (
    <Alert variant="error" title="Payment failed">
      Your card was declined. Please try another payment method.
    </Alert>
  );
}
