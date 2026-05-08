import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tpl = (name) =>
  readFileSync(resolve(__dirname, `../templates/${name}.md`), "utf-8");

export const templates = {
  claude:   tpl("claude"),
  cursor:   tpl("cursor"),
  copilot:  tpl("copilot"),
  windsurf: tpl("windsurf"),
  generic:  tpl("generic"),
};

export const TOOLS = ["claude", "cursor", "copilot", "windsurf", "generic"];

/**
 * Get the full template markdown for a given AI tool.
 * @param {"claude"|"cursor"|"copilot"|"windsurf"|"generic"} tool
 */
export function getTemplate(tool) {
  if (!templates[tool]) {
    throw new Error(
      `Unknown tool "${tool}". Available: ${TOOLS.join(", ")}`
    );
  }
  return templates[tool];
}
