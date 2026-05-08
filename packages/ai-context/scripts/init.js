#!/usr/bin/env node
// npx @usevyre/ai-context init --claude|--cursor|--windsurf|--copilot

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir   = resolve(__dirname, "../dist");

const TARGETS = {
  "--claude":   { src: "claude-context.md",       dest: "CLAUDE.md",                    label: "CLAUDE.md"                    },
  "--cursor":   { src: "cursor-rules.md",          dest: ".cursor/rules",                label: ".cursor/rules"                },
  "--windsurf": { src: "windsurf-rules.md",        dest: ".windsurf/rules",              label: ".windsurf/rules"              },
  "--copilot":  { src: "copilot-instructions.md",  dest: ".github/copilot-instructions.md", label: ".github/copilot-instructions.md" },
};

const MARKER_START = "<!-- usevyre-context:start -->";
const MARKER_END   = "<!-- usevyre-context:end -->";

function run() {
  const args = process.argv.slice(2);
  const flag = args.find((a) => a.startsWith("--"));

  if (!flag || flag === "--help") {
    console.log(`
Usage: npx @usevyre/ai-context init <flag>

Flags:
  --claude    Write context to CLAUDE.md
  --cursor    Write context to .cursor/rules
  --windsurf  Write context to .windsurf/rules
  --copilot   Write context to .github/copilot-instructions.md
`);
    process.exit(flag === "--help" ? 0 : 1);
  }

  const target = TARGETS[flag];
  if (!target) {
    console.error(`Unknown flag: ${flag}`);
    console.error(`Valid flags: ${Object.keys(TARGETS).join(", ")}`);
    process.exit(1);
  }

  const srcPath  = resolve(distDir, target.src);
  const destPath = resolve(process.cwd(), target.dest);

  if (!existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    console.error("Run 'pnpm build' in packages/ai-context first.");
    process.exit(1);
  }

  const content = readFileSync(srcPath, "utf-8");
  const block   = `${MARKER_START}\n${content.trim()}\n${MARKER_END}`;

  // Ensure destination directory exists
  const destDir = dirname(destPath);
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  if (existsSync(destPath)) {
    let existing = readFileSync(destPath, "utf-8");

    if (existing.includes(MARKER_START)) {
      // Replace existing block between markers
      const re = new RegExp(
        `${escapeRe(MARKER_START)}[\\s\\S]*?${escapeRe(MARKER_END)}`,
        "m"
      );
      existing = existing.replace(re, block);
      writeFileSync(destPath, existing, "utf-8");
      console.log(`✓ Updated useVyre context block in ${target.label}`);
    } else {
      // Append to existing file
      writeFileSync(destPath, existing.trimEnd() + "\n\n" + block + "\n", "utf-8");
      console.log(`✓ Appended useVyre context block to ${target.label}`);
    }
  } else {
    // Create new file
    writeFileSync(destPath, block + "\n", "utf-8");
    console.log(`✓ Created ${target.label} with useVyre context`);
  }

  console.log(`  Re-run this command after upgrading @usevyre packages.`);
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

run();
