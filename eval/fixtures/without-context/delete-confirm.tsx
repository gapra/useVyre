// WITHOUT useVyre context — model guesses a destructive variant name.
import { Button } from "@usevyre/react";

export function DeleteAccountButton() {
  // "destructive" is the common shadcn name; useVyre uses "danger".
  return (
    <Button variant="destructive" onClick={() => {}}>
      Delete account
    </Button>
  );
}
