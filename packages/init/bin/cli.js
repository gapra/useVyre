#!/usr/bin/env node
// npx @usevyre/init  — one-command setup for useVyre in an existing React/Vue app.
//
// Flags:
//   --react | --vue              override framework detection
//   --ai <claude|cursor|windsurf|copilot>   also set up AI context
//   --dry-run                    print the plan; install/edit nothing
//   --help

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { execSync } from "node:child_process";
import {
  detectFramework,
  detectPackageManager,
  findEntryFile,
  ensureStylesImport,
  installCommand,
} from "../src/index.js";

const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const info = (m) => console.log(`\x1b[36mℹ\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[33m!\x1b[0m ${m}`);

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--react") flags.react = true;
    else if (a === "--vue") flags.vue = true;
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--ai") flags.ai = argv[++i];
  }
  return flags;
}

const HELP = `
Usage: npx @usevyre/init [options]

Sets up useVyre in the current React or Vue project: installs the package,
adds the styles import, and guides the remaining steps.

Options:
  --react | --vue         Choose the framework (otherwise auto-detected)
  --ai <target>           Also set up AI context (claude|cursor|windsurf|copilot)
  --dry-run               Show what would happen without changing anything
  --help                  Show this help
`;

function run() {
  const flags = parseFlags(process.argv.slice(2));
  if (flags.help) {
    console.log(HELP);
    return;
  }

  const cwd = process.cwd();
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    console.error("No package.json here. Run this inside your project.");
    process.exit(1);
  }
  const pkgJson = JSON.parse(readFileSync(pkgPath, "utf8"));

  let framework;
  try {
    framework = detectFramework(pkgJson, flags);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const pm = detectPackageManager(cwd);
  const install = installCommand(pm, framework);
  const dry = flags.dryRun;

  info(`Project: ${framework} · package manager: ${pm}${dry ? " · dry-run" : ""}`);

  // 1. Install the package.
  if (dry) {
    info(`Would run: ${install}`);
  } else {
    try {
      execSync(install, { cwd, stdio: "inherit" });
      ok(`Installed @usevyre/${framework}`);
    } catch {
      warn(`Install failed — run it yourself: ${install}`);
    }
  }

  // 2. Insert the styles import (the one safe file edit).
  const entry = findEntryFile(cwd);
  const importLine = `import "@usevyre/${framework}/styles";`;
  if (!entry) {
    warn(`No entry file found. Add this to your app entry: ${importLine}`);
  } else {
    const rel = relative(cwd, entry);
    const current = readFileSync(entry, "utf8");
    const { content, changed } = ensureStylesImport(current, framework);
    if (!changed) {
      ok(`Styles import already present in ${rel}`);
    } else if (dry) {
      info(`Would add styles import to ${rel}`);
    } else {
      writeFileSync(entry, content);
      ok(`Added styles import to ${rel}`);
    }
  }

  // 3. Guide ToastProvider (no JSX edit — printed, not applied).
  info("Next: wrap your app to enable toasts —");
  if (framework === "react") {
    console.log(
      `    import { ToastProvider } from "@usevyre/react";\n` +
      `    <ToastProvider>{/* your app */}</ToastProvider>`
    );
  } else {
    console.log(
      `    import { ToastViewport } from "@usevyre/vue";\n` +
      `    <!-- add <ToastViewport /> once at your app root -->`
    );
  }

  // 4. AI context — run if asked, else suggest.
  if (flags.ai) {
    const cmd = `npx @usevyre/ai-context init --${flags.ai}`;
    if (dry) {
      info(`Would run: ${cmd}`);
    } else {
      try {
        execSync(cmd, { cwd, stdio: "inherit" });
      } catch {
        warn(`AI context setup failed — run it yourself: ${cmd}`);
      }
    }
  } else {
    info(
      "Tip: set up AI context so agents generate correct useVyre code —\n" +
      "    npx @usevyre/ai-context init --claude"
    );
  }

  ok("useVyre is ready.");
}

run();
