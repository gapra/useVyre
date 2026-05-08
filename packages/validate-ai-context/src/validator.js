import { schema, antiPatterns } from "@usevyre/ai-context";

const { components } = schema;

// ── Prop value validation ─────────────────────────────────────────────────────

/**
 * Parse JSX attribute string like:
 *   <Button variant="primary" size="xl" loading>
 * Returns { componentName, props: { variant: "primary", size: "xl", loading: true } }
 */
function parseJsxTag(tagStr) {
  const nameMatch = tagStr.match(/^<(\w+)/);
  if (!nameMatch) return null;
  const componentName = nameMatch[1];

  const props = {};

  // String props: prop="value"
  for (const m of tagStr.matchAll(/(\w+)="([^"]*)"/g)) {
    props[m[1]] = m[2];
  }

  // Boolean props: just the name (no value)
  for (const m of tagStr.matchAll(/\s(\w+)(?=[\s/>])/g)) {
    if (!(m[1] in props) && m[1] !== componentName) {
      props[m[1]] = true;
    }
  }

  return { componentName, props };
}

/**
 * Validate a single JSX tag against the component schema.
 * Returns array of { type, prop, value, message, fix, severity }
 */
function validateTag(tagStr) {
  const parsed = parseJsxTag(tagStr);
  if (!parsed) return [];

  const { componentName, props } = parsed;
  const compDef = components[componentName];
  if (!compDef) return []; // not a useVyre component, skip

  const issues = [];
  const propDefs = compDef.props || {};

  for (const [propName, value] of Object.entries(props)) {
    if (propName === "className" || propName === "style" || propName === "data-testid") continue;

    const propDef = propDefs[propName];

    if (!propDef) {
      // Check if this is a known hallucinated prop (e.g. color= on Button)
      const knownNonExistent = antiPatterns.rules.find(
        r => r.component === componentName && r.pattern.includes(`${propName}=`)
      );
      if (knownNonExistent) {
        issues.push({
          type: "hallucinated-prop",
          prop: propName,
          value,
          message: `<${componentName}> has no "${propName}" prop. ${knownNonExistent.reason}`,
          fix: knownNonExistent.fix,
          severity: knownNonExistent.severity ?? "error",
        });
      }
      continue;
    }

    // Validate enum values
    if (propDef.values && typeof value === "string") {
      if (!propDef.values.includes(value)) {
        const closestMatch = propDef.values.find(v =>
          v.startsWith(value[0]) || value.startsWith(v[0])
        );
        issues.push({
          type: "invalid-enum-value",
          prop: propName,
          value,
          message: `<${componentName} ${propName}="${value}"> — "${value}" is not a valid value.`,
          fix: `Valid values: ${propDef.values.map(v => `"${v}"`).join(", ")}${closestMatch ? `. Did you mean "${closestMatch}"?` : ""}`,
          severity: "error",
        });
      }
    }
  }

  return issues;
}

/**
 * Validate raw source code (JSX/TSX string).
 * Extracts all JSX opening tags and validates each one.
 * Returns array of { tag, line, issues }
 */
export function validateSource(code, filename = "<source>") {
  const results = [];
  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match opening JSX tags: <ComponentName ...>  or <ComponentName ... />
    for (const m of line.matchAll(/<([A-Z]\w*)([^>]*)\/?>/g)) {
      const tagStr = m[0];
      const issues = validateTag(tagStr);

      if (issues.length > 0) {
        results.push({
          filename,
          line: i + 1,
          col: m.index + 1,
          tag: tagStr,
          issues,
        });
      }
    }
  }

  return results;
}

/**
 * Format results as human-readable CLI output.
 * Returns { output: string, errorCount: number, warningCount: number }
 */
export function formatResults(allResults) {
  let errorCount = 0;
  let warningCount = 0;
  const lines = [];

  for (const result of allResults) {
    for (const issue of result.issues) {
      if (issue.severity === "error") errorCount++;
      else warningCount++;

      const prefix = issue.severity === "error" ? "❌" : "⚠️ ";
      lines.push(`${prefix} ${result.filename}:${result.line}:${result.col}`);
      lines.push(`   ${issue.message}`);
      lines.push(`   → ${issue.fix}`);
      lines.push("");
    }
  }

  return { output: lines.join("\n"), errorCount, warningCount };
}

/**
 * Validate a single JSX snippet string (for testing or programmatic use).
 * Returns { valid, issues }
 */
export function validateSnippet(snippet) {
  const results = validateSource(snippet, "<snippet>");
  const issues = results.flatMap(r => r.issues);
  return { valid: issues.length === 0, issues };
}
