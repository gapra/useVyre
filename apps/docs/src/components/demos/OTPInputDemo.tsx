import { useState } from "react";
import { OTPInput, Stack, Text } from "@usevyre/react";

export function OTPInputDemo() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);

  return (
    <Stack direction="column" gap="md" align="center">
      <Text size="sm" color="muted">
        Enter the 6-digit code (try pasting "123456")
      </Text>
      <OTPInput
        value={code}
        onChange={(v) => {
          setCode(v);
          setDone(false);
        }}
        onComplete={() => setDone(true)}
      />
      {done && (
        <Text size="sm" style={{ color: "var(--vyre-color-semantic-teal)" }}>
          ✓ Code complete: {code}
        </Text>
      )}
    </Stack>
  );
}

export function OTPInputMaskedDemo() {
  const [pin, setPin] = useState("");

  return (
    <Stack direction="column" gap="md" align="center">
      <Text size="sm" color="muted">Masked 4-digit PIN</Text>
      <OTPInput value={pin} onChange={setPin} length={4} mask size="lg" />
    </Stack>
  );
}
