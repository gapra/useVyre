/**
 * Build-output contract: the React bundle must carry the "use client" directive
 * as its first line, so the components (33 use hooks) work in React Server
 * Components / Next.js App Router without consumers adding it themselves.
 *
 * This guards against a build/Vite-config change silently dropping the banner —
 * a regression that's invisible until a Next.js user hits a runtime error.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

function firstDirective(file: string): string {
  const content = readFileSync(resolve(ROOT, file), "utf8");
  return content.trimStart().slice(0, 40);
}

describe("React bundle — 'use client' directive", () => {
  it("ESM build starts with \"use client\"", () => {
    expect(firstDirective("packages/react/dist/index.js")).toMatch(
      /^["']use client["'];/,
    );
  });

  it("CJS build starts with \"use client\"", () => {
    expect(firstDirective("packages/react/dist/index.cjs")).toMatch(
      /^["']use client["'];/,
    );
  });
});
