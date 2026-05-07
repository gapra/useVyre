import { Button, Badge, Card, CardBody } from "@usevyre/react";

export default function HeroDemo() {
  return (
    <div className="hero-demo">
      <Card variant="elevated" style={{ maxWidth: 340 }}>
        <CardBody>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Badge variant="teal" dot>AI-ready</Badge>
            <Badge variant="accent">v0.5</Badge>
          </div>
          <p style={{
            fontFamily: "var(--vyre-typography-font-family-body)",
            fontSize: "var(--vyre-typography-font-size-sm)",
            color: "var(--vyre-color-semantic-text-secondary)",
            margin: "0 0 20px",
            lineHeight: "var(--vyre-typography-line-height-normal)",
          }}>
            Components with built-in AI context. Zero hallucinations.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="accent" size="sm">Button</Button>
            <Button variant="ghost" size="sm">Button Variant</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
