import { useState } from "react";
import { Carousel, CarouselSlide, Stack, Text, Heading } from "@usevyre/react";

const slides = [
  { bg: "var(--vyre-color-semantic-accent-subtle)", title: "Welcome", body: "Build AI-friendly UIs." },
  { bg: "var(--vyre-color-semantic-teal-subtle)", title: "Compose", body: "Stack, Grid, Box — token-locked." },
  { bg: "var(--vyre-color-semantic-success-subtle)", title: "Ship", body: "Zero hallucinations." },
];

export function CarouselDemo() {
  const [i, setI] = useState(0);

  return (
    <Stack direction="column" gap="sm" style={{ width: "100%", maxWidth: 480 }}>
      <Carousel value={i} onChange={setI} loop>
        {slides.map((s) => (
          <CarouselSlide key={s.title}>
            <div
              style={{
                background: s.bg,
                borderRadius: "var(--vyre-border-radius-lg)",
                padding: "var(--vyre-spacing-12) var(--vyre-spacing-6)",
                textAlign: "center",
              }}
            >
              <Heading size="md">{s.title}</Heading>
              <Text color="muted">{s.body}</Text>
            </div>
          </CarouselSlide>
        ))}
      </Carousel>
      <Text size="sm" color="muted">
        Slide {i + 1} of {slides.length}
      </Text>
    </Stack>
  );
}
