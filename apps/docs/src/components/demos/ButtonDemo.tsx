import { Button } from "@vyre/react";

export function ButtonVariantsDemo() {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="teal">Teal</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}

export function ButtonSizesDemo() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Button variant="accent" size="sm">Small</Button>
      <Button variant="accent" size="md">Medium</Button>
      <Button variant="accent" size="lg">Large</Button>
    </div>
  );
}

export function ButtonStatesDemo() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Button variant="accent">Default</Button>
      <Button variant="accent" loading>Loading</Button>
      <Button variant="accent" disabled>Disabled</Button>
    </div>
  );
}
