/**
 * Unit tests for @usevyre/init pure helpers. These cover the logic that decides
 * what the CLI does — framework/package-manager/entry detection and the
 * idempotent styles-import insertion — without running a real install or
 * touching the user's actual project.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mod: any;
beforeAll(async () => {
  mod = await import(resolve(ROOT, "packages/init/src/index.js"));
});

function tmp() {
  return mkdtempSync(join(tmpdir(), "vyre-init-"));
}

describe("detectFramework", () => {
  it("returns react when react is a dependency", () => {
    expect(mod.detectFramework({ dependencies: { react: "18" } }, {})).toBe("react");
  });
  it("returns vue when vue is a dependency", () => {
    expect(mod.detectFramework({ dependencies: { vue: "3" } }, {})).toBe("vue");
  });
  it("honors an explicit --vue flag over detection", () => {
    expect(mod.detectFramework({ dependencies: { react: "18" } }, { vue: true })).toBe("vue");
  });
  it("throws when both present and no flag (ambiguous)", () => {
    expect(() => mod.detectFramework({ dependencies: { react: "18", vue: "3" } }, {})).toThrow();
  });
  it("throws when neither present and no flag", () => {
    expect(() => mod.detectFramework({ dependencies: {} }, {})).toThrow();
  });
});

describe("detectPackageManager", () => {
  it("detects pnpm from pnpm-lock.yaml", () => {
    const d = tmp();
    writeFileSync(join(d, "pnpm-lock.yaml"), "");
    expect(mod.detectPackageManager(d)).toBe("pnpm");
  });
  it("detects yarn from yarn.lock", () => {
    const d = tmp();
    writeFileSync(join(d, "yarn.lock"), "");
    expect(mod.detectPackageManager(d)).toBe("yarn");
  });
  it("defaults to npm when no lockfile", () => {
    expect(mod.detectPackageManager(tmp())).toBe("npm");
  });
});

describe("findEntryFile", () => {
  it("returns the first existing candidate (src/main.tsx)", () => {
    const d = tmp();
    mkdirSync(join(d, "src"));
    writeFileSync(join(d, "src/main.tsx"), "");
    expect(mod.findEntryFile(d)).toBe(join(d, "src/main.tsx"));
  });
  it("returns null when no entry candidate exists", () => {
    expect(mod.findEntryFile(tmp())).toBeNull();
  });
});

describe("ensureStylesImport (idempotent, pure)", () => {
  it("prepends the styles import when absent", () => {
    const { content, changed } = mod.ensureStylesImport("const x = 1;\n", "react");
    expect(changed).toBe(true);
    expect(content.startsWith('import "@usevyre/react/styles";')).toBe(true);
    expect(content).toContain("const x = 1;");
  });
  it("is a no-op when the import is already present", () => {
    const input = 'import "@usevyre/vue/styles";\nconst x = 1;\n';
    const { content, changed } = mod.ensureStylesImport(input, "vue");
    expect(changed).toBe(false);
    expect(content).toBe(input);
  });
});
