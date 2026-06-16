/**
 * Contract: every AI-context target must tell agents how to use icons — useVyre
 * ships none, so a node from a library (lucide) goes into icon/leftIcon/etc.
 * Without this, agents invent a @usevyre/icons import or an icon="name" string.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const DIST = resolve(ROOT, "packages/ai-context/dist");

const targets = [
  "full-context.md",
  "claude-context.md",
  "copilot-instructions.md",
  "windsurf-rules.md",
  "cursor-rules.md",
];

describe("AI context — icon guidance", () => {
  it.each(targets)("%s mentions lucide / bring-your-own icons", (file) => {
    const content = readFileSync(resolve(DIST, file), "utf8").toLowerCase();
    expect(content).toContain("lucide");
    // and steers away from a non-existent icon package
    expect(content).toMatch(/no icon|ship.*no.*icon|@usevyre\/icons/);
  });
});
