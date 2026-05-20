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

  // String literal props: prop="value" — enum-checkable.
  for (const m of tagStr.matchAll(/(\w+)="([^"]*)"/g)) {
    props[m[1]] = m[2];
  }

  // JSX expression props: prop={...} — the value is opaque to us (it's a
  // runtime expression), but the prop NAME must still be validated against
  // the schema. Marking value as null distinguishes from string literal in
  // case callers care (current rules don't — enum-check skips non-strings
  // and hallucinated-prop check only needs the name). Without this branch
  // the validator silently misses real-world usage like
  //   <Switch onChange={handler}>     // schema-callback-drift class
  //   <Button color={brand}>          // canonical Button hallucination
  // because agents and humans frequently bind props to variables.
  // The brace-counting walk handles nested braces (objects, arrow bodies).
  for (let i = 0; i < tagStr.length; i++) {
    const propStart = tagStr.slice(i).match(/^(\w+)=\{/);
    if (!propStart) continue;
    const propName = propStart[1];
    if (propName in props) { i += propStart[0].length - 1; continue; }
    // Find the matching close-brace, respecting nesting.
    let depth = 1;
    let j = i + propStart[0].length;
    while (j < tagStr.length && depth > 0) {
      const ch = tagStr[j];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      j++;
    }
    if (depth === 0) {
      props[propName] = null; // opaque value
      i = j - 1;
    }
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
      // Prop isn't in the schema — could be a native HTML pass-through
      // (e.g. <Input type="email">), a sibling-component prop the agent
      // mis-aimed (e.g. variant on DropdownMenu vs DropdownItem), or a
      // genuine hallucination. We only flag the last category, recognized
      // by an antiPattern whose `pattern` is a bare prop declaration like
      // `color="..."` or `icon={...}` — i.e. starts with `prop=` and has
      // no surrounding context. Old heuristic (pattern string contains
      // `${prop}=` anywhere) produced false positives on antiPatterns
      // worded as guidance about a misuse of a real prop, like
      //   "type=\"search\" for search UI"
      //   "DropdownItem variant=\"primary\""
      //   "value as tuple for mode=\"single\""
      // See tests "no false positives from contextual antiPatterns".
      const declaresPropAbsent = (pattern) => {
        const re = new RegExp(`^${propName}=("[^"]*"|\\{[^}]*\\}|\\.\\.\\.)\\s*$`);
        return re.test(pattern);
      };
      const declaredNonExistent = antiPatterns.rules.find(
        r => r.component === componentName && declaresPropAbsent(r.pattern),
      );
      if (declaredNonExistent) {
        issues.push({
          type: "hallucinated-prop",
          prop: propName,
          value,
          message: `<${componentName}> has no "${propName}" prop. ${declaredNonExistent.reason}`,
          fix: declaredNonExistent.fix,
          severity: declaredNonExistent.severity ?? "error",
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

    // Extract opening JSX tags: `<ComponentName ...>` or `<ComponentName ... />`.
    // The previous regex `[^>]*` terminated at the first `>` even when that
    // `>` was inside `{<Icon />}` or `{() => ...}`, truncating the tag and
    // hiding hallucinated props (icon={<Icon />}, color={brand} after an
    // arrow-body, etc). This walk is brace-aware and quote-aware so a `>`
    // only closes the tag when at depth 0 outside any string.
    for (let start = 0; start < line.length; start++) {
      const m = line.slice(start).match(/^<([A-Z]\w*)/);
      if (!m) continue;
      let depth = 0;
      let inDouble = false, inSingle = false;
      let j = start + m[0].length;
      let closed = false;
      while (j < line.length) {
        const ch = line[j];
        if (inDouble) { if (ch === '"') inDouble = false; }
        else if (inSingle) { if (ch === "'") inSingle = false; }
        else if (ch === '"') inDouble = true;
        else if (ch === "'") inSingle = true;
        else if (ch === "{") depth++;
        else if (ch === "}") depth--;
        else if (ch === ">" && depth === 0) { closed = true; j++; break; }
        j++;
      }
      if (!closed) { start += m[0].length - 1; continue; }
      const tagStr = line.slice(start, j);
      const issues = validateTag(tagStr);
      if (issues.length > 0) {
        results.push({
          filename,
          line: i + 1,
          col: start + 1,
          tag: tagStr,
          issues,
        });
      }
      start = j - 1; // resume after this tag
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
