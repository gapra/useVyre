import { useState } from "react";
import {
  Stepper,
  StepperNav,
  Step,
  StepPanel,
  Stack,
  Button,
  Text,
} from "@usevyre/react";

export function StepperDemo() {
  const [step, setStep] = useState(0);
  const last = 2;

  return (
    <Stepper value={step} onChange={setStep} clickable style={{ width: "100%", maxWidth: 460 }}>
      <StepperNav>
        <Step index={0} label="Account" description="Email & password" />
        <Step index={1} label="Profile" description="Your details" />
        <Step index={2} label="Done" description="Review" />
      </StepperNav>
      <StepPanel index={0}>
        <Text>Step 1 — create your account.</Text>
      </StepPanel>
      <StepPanel index={1}>
        <Text>Step 2 — fill in your profile.</Text>
      </StepPanel>
      <StepPanel index={2}>
        <Text>Step 3 — review and finish. 🎉</Text>
      </StepPanel>
      <Stack direction="row" gap="sm" justify="between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep((s) => Math.min(s + 1, last))}
          disabled={step === last}
        >
          {step === last ? "Finish" : "Next"}
        </Button>
      </Stack>
    </Stepper>
  );
}

export function StepperVerticalDemo() {
  const [step, setStep] = useState(1);

  return (
    <Stepper
      orientation="vertical"
      value={step}
      onChange={setStep}
      clickable
      style={{ width: "100%", maxWidth: 360 }}
    >
      <StepperNav>
        <Step index={0} label="Cart" description="2 items" />
        <Step index={1} label="Shipping" description="Enter address" />
        <Step index={2} label="Payment" description="Card details" />
        <Step index={3} label="Review" description="Confirm order" />
      </StepperNav>
      <Stack direction="row" gap="sm" justify="end">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep((s) => Math.min(s + 1, 3))}
          disabled={step === 3}
        >
          Next
        </Button>
      </Stack>
    </Stepper>
  );
}
