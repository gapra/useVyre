// @usevyre/init — pure helpers (no side effects), unit-tested in tests/init-cli.test.ts.
// The bin/cli.js orchestrator wires these to fs / child_process and prints.

import { existsSync } from "node:fs";
import { join } from "node:path";

const ENTRY_CANDIDATES = [
  "src/main.tsx",
  "src/main.ts",
  "src/index.tsx",
  "src/index.ts",
  "src/main.js",
  "src/index.js",
];

/**
 * Decide which framework to set up.
 * Explicit flags win; otherwise infer from the project's dependencies.
 * Throws when it can't be determined unambiguously (caller prints guidance).
 */
export function detectFramework(pkgJson, flags = {}) {
  if (flags.react) return "react";
  if (flags.vue) return "vue";
  const deps = {
    ...(pkgJson?.dependencies ?? {}),
    ...(pkgJson?.devDependencies ?? {}),
  };
  const hasReact = Boolean(deps.react || deps["react-dom"]);
  const hasVue = Boolean(deps.vue);
  if (hasReact && hasVue) {
    throw new Error(
      "Both React and Vue found. Re-run with --react or --vue to choose."
    );
  }
  if (hasReact) return "react";
  if (hasVue) return "vue";
  throw new Error(
    "No React or Vue dependency found. Run inside your app, or pass --react / --vue."
  );
}

/** Detect the package manager from the lockfile present in cwd. Defaults to npm. */
export function detectPackageManager(cwd) {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "package-lock.json"))) return "npm";
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

/** Return the first existing entry-file candidate, or null. */
export function findEntryFile(cwd) {
  for (const rel of ENTRY_CANDIDATES) {
    const full = join(cwd, rel);
    if (existsSync(full)) return full;
  }
  return null;
}

/**
 * Ensure the self-contained styles import is the first line. Pure + idempotent:
 * returns the (possibly unchanged) content and whether it changed.
 */
export function ensureStylesImport(content, framework) {
  const importLine = `import "@usevyre/${framework}/styles";`;
  // Match the import regardless of quote style / trailing semicolon.
  const present = new RegExp(
    `import\\s+["']@usevyre/${framework}/styles["']`
  ).test(content);
  if (present) return { content, changed: false };
  return { content: `${importLine}\n${content}`, changed: true };
}

/**
 * The install command for a given package manager, as an argv array
 * (`[command, ...args]`) so callers can use execFileSync without a shell —
 * no string interpolation reaches a shell, so there is no injection surface.
 */
export function installCommand(pm, framework) {
  const pkg = `@usevyre/${framework}`;
  switch (pm) {
    case "pnpm": return ["pnpm", "add", pkg];
    case "yarn": return ["yarn", "add", pkg];
    case "bun": return ["bun", "add", pkg];
    default: return ["npm", "install", pkg];
  }
}
