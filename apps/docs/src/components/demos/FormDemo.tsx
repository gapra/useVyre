import { useState } from "react";
import { Form, FormField, Input, Button, Stack } from "@usevyre/react";

export function FormDemo() {
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [done, setDone] = useState(false);

  return (
    <Form
      values={values}
      onChange={setValues}
      onSubmit={() => setDone(true)}
      style={{ width: "100%", maxWidth: 360 }}
    >
      <FormField name="email" label="Email" rules={{ required: true, email: true }}>
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormField
        name="password"
        label="Password"
        hint="At least 8 characters"
        rules={{ required: true, minLength: 8 }}
      >
        <Input type="password" placeholder="••••••••" />
      </FormField>
      <FormField
        name="confirm"
        label="Confirm password"
        rules={{
          required: true,
          validate: (v, all) =>
            v === all.password ? null : "Passwords do not match",
        }}
      >
        <Input type="password" placeholder="••••••••" />
      </FormField>
      <Stack direction="row" gap="sm" justify="end">
        <Button type="submit" variant="primary">
          Create account
        </Button>
      </Stack>
      {done && (
        <p style={{ color: "var(--vyre-color-semantic-teal)", fontSize: 14 }}>
          ✓ Submitted — form is valid.
        </p>
      )}
    </Form>
  );
}
