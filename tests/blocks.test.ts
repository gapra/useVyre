/**
 * Contract tests for useVyre composition Blocks.
 *
 * Blocks are copy-paste compositions of existing components, sourced from
 * packages/ai-context/src/blocks/*.md and injected into the generated AI
 * context. These guard the structure of each block and that the build surfaces
 * them, so AI agents reliably get the composition patterns.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const BLOCKS_DIR = resolve(ROOT, "packages/ai-context/src/blocks");

function blockFiles(): string[] {
  return readdirSync(BLOCKS_DIR).filter((f) => f.endsWith(".md"));
}

describe("blocks — source structure", () => {
  it("has at least one block", () => {
    expect(blockFiles().length).toBeGreaterThan(0);
  });

  it.each(blockFiles())("%s has the required sections", (file) => {
    const md = readFileSync(resolve(BLOCKS_DIR, file), "utf8");
    expect(md).toMatch(/^# \w/m); // a title
    expect(md).toMatch(/\*\*Use when:\*\*/);
    expect(md).toMatch(/\*\*Components:\*\*/);
    expect(md).toMatch(/## React\s+```tsx[\s\S]+?```/);
    expect(md).toMatch(/## Vue\s+```vue[\s\S]+?```/);
  });
});

describe("blocks — AI-context injection (requires build)", () => {
  const fullContext = resolve(ROOT, "packages/ai-context/dist/full-context.md");
  const blocksDist = resolve(ROOT, "packages/ai-context/dist/blocks.md");

  it("emits dist/blocks.md", () => {
    expect(existsSync(blocksDist)).toBe(true);
  });

  it("injects a Composition Blocks section into full-context.md", () => {
    const content = readFileSync(fullContext, "utf8");
    expect(content).toContain("Composition Blocks");
    // each block title should appear
    for (const f of blockFiles()) {
      const title = readFileSync(resolve(BLOCKS_DIR, f), "utf8").match(/^# (.+)$/m)?.[1];
      if (title) expect(content).toContain(title);
    }
  });
});
