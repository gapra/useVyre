#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { schema, antiPatterns, cheatSheets, versionInfo, claudeContext } from "@usevyre/ai-context";

const { components } = schema;
const componentNames = Object.keys(components);

// ── Server setup ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "usevyre-context",
  version: schema.version,
});

// ── Tool: get_component_info ──────────────────────────────────────────────────

server.tool(
  "get_component_info",
  "Get full context for a useVyre component: props, valid values, anti-patterns, and examples.",
  {
    component: z.string().describe("Component name (e.g. 'Button', 'Badge', 'Card')"),
  },
  async ({ component }) => {
    // Case-insensitive match
    const key = componentNames.find(
      (n) => n.toLowerCase() === component.toLowerCase()
    );

    if (!key) {
      const similar = componentNames.filter((n) =>
        n.toLowerCase().includes(component.toLowerCase().slice(0, 3))
      );
      return {
        content: [
          {
            type: "text",
            text: [
              `Component "${component}" not found in useVyre.`,
              similar.length > 0
                ? `Did you mean: ${similar.join(", ")}?`
                : `Available components: ${componentNames.join(", ")}`,
            ].join("\n"),
          },
        ],
        isError: true,
      };
    }

    const comp = components[key];
    return {
      content: [
        {
          type: "text",
          text: cheatSheets[key] ?? `No cheat sheet found for ${key}`,
        },
      ],
    };
  }
);

// ── Tool: get_valid_props ─────────────────────────────────────────────────────

server.tool(
  "get_valid_props",
  "Get all valid prop values for a useVyre component. Use this before generating component code to avoid hallucinations.",
  {
    component: z.string().describe("Component name (e.g. 'Button')"),
  },
  async ({ component }) => {
    const key = componentNames.find(
      (n) => n.toLowerCase() === component.toLowerCase()
    );
    if (!key) {
      return {
        content: [{ type: "text", text: `Component "${component}" not found.` }],
        isError: true,
      };
    }

    const comp = components[key];
    const props = comp.props ?? {};
    const lines = [`## ${key} — Valid Props`, ""];

    for (const [name, prop] of Object.entries(props)) {
      if (prop.values) {
        const def = prop.default !== undefined ? ` (default: "${prop.default}")` : "";
        lines.push(`**${name}**: ${prop.values.map((v) => `"${v}"`).join(" | ")}${def}`);
      } else if (prop.type === "boolean") {
        const def = prop.default !== undefined ? ` (default: ${prop.default})` : "";
        lines.push(`**${name}**: boolean${def}`);
      } else {
        lines.push(`**${name}**: ${prop.type ?? "any"}`);
      }
    }

    if (Object.keys(props).length === 0) {
      lines.push("No configurable props — this component uses subcomponents for composition.");
      if (comp.subcomponents?.length) {
        lines.push(`Subcomponents: ${comp.subcomponents.join(", ")}`);
      }
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ── Tool: check_valid_prop_value ──────────────────────────────────────────────

server.tool(
  "check_valid_prop_value",
  "Check if a specific prop value is valid for a useVyre component. Returns valid/invalid + suggestion.",
  {
    component: z.string().describe("Component name (e.g. 'Button')"),
    prop: z.string().describe("Prop name (e.g. 'variant', 'size')"),
    value: z.string().describe("Value to check (e.g. 'primary', 'xl')"),
  },
  async ({ component, prop, value }) => {
    const key = componentNames.find(
      (n) => n.toLowerCase() === component.toLowerCase()
    );
    if (!key) {
      return {
        content: [{ type: "text", text: `Component "${component}" not found.` }],
        isError: true,
      };
    }

    const comp = components[key];
    const propDef = (comp.props ?? {})[prop];

    if (!propDef) {
      // Check anti-patterns for known hallucinated props
      const ap = (comp.antiPatterns ?? []).find((a) =>
        a.pattern.startsWith(`${prop}=`)
      );
      if (ap) {
        return {
          content: [
            {
              type: "text",
              text: `❌ "${prop}" is not a valid prop on ${key}.\n${ap.reason}\n→ ${ap.fix}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `"${prop}" is not a documented prop on ${key}. Valid props: ${Object.keys(comp.props ?? {}).join(", ")}`,
          },
        ],
      };
    }

    if (!propDef.values) {
      return {
        content: [
          {
            type: "text",
            text: `✅ "${prop}" on ${key} accepts: ${propDef.type}. "${value}" is not enum-validated.`,
          },
        ],
      };
    }

    const isValid = propDef.values.includes(value);
    if (isValid) {
      return {
        content: [
          {
            type: "text",
            text: `✅ "${value}" is a valid value for ${key} ${prop}.\nAll valid values: ${propDef.values.map((v) => `"${v}"`).join(", ")}`,
          },
        ],
      };
    }

    const closest = propDef.values.find(
      (v) => v.startsWith(value[0]) || value.startsWith(v[0])
    );
    return {
      content: [
        {
          type: "text",
          text: [
            `❌ "${value}" is NOT a valid value for ${key} ${prop}.`,
            `Valid values: ${propDef.values.map((v) => `"${v}"`).join(", ")}`,
            closest ? `Did you mean: "${closest}"?` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    };
  }
);

// ── Tool: suggest_component ───────────────────────────────────────────────────

server.tool(
  "suggest_component",
  "Suggest the best useVyre component(s) for a given use case or description.",
  {
    use_case: z
      .string()
      .describe(
        "Describe what you want to build (e.g. 'loading state', 'user avatar with status', 'search interface')"
      ),
  },
  async ({ use_case }) => {
    const query = use_case.toLowerCase();

    // Keyword → component mapping
    const hints = [
      { keywords: ["button", "cta", "action", "submit", "click", "link"], components: ["Button"] },
      { keywords: ["badge", "tag", "label", "status", "pill"], components: ["Badge"] },
      { keywords: ["card", "panel", "container", "section"], components: ["Card"] },
      { keywords: ["input", "text", "field", "form", "email", "password"], components: ["Field", "Input"] },
      { keywords: ["select", "dropdown", "picker", "choose", "option"], components: ["Select", "DropdownMenu"] },
      { keywords: ["modal", "dialog", "popup", "confirm", "overlay"], components: ["Modal", "Alert"] },
      { keywords: ["alert", "notification", "warning", "error", "success", "info"], components: ["Alert", "Toast"] },
      { keywords: ["toast", "snackbar", "transient", "ephemeral"], components: ["Toast"] },
      { keywords: ["avatar", "user", "profile", "photo", "initials"], components: ["Avatar"] },
      { keywords: ["search", "command", "palette", "quick"], components: ["Command"] },
      { keywords: ["loading", "spinner", "skeleton", "placeholder"], components: ["Skeleton", "Button"] },
      { keywords: ["progress", "upload", "percentage", "bar"], components: ["Progress"] },
      { keywords: ["sidebar", "nav", "navigation", "menu", "drawer"], components: ["Sidebar", "Sheet"] },
      { keywords: ["sheet", "panel", "side panel", "offcanvas"], components: ["Sheet"] },
      { keywords: ["tabs", "tabbed", "tab", "switcher"], components: ["Tabs"] },
      { keywords: ["table", "data", "grid", "rows", "columns", "list"], components: ["Table", "Pagination"] },
      { keywords: ["tooltip", "hint", "hover", "title"], components: ["Tooltip", "Popover"] },
      { keywords: ["popover", "floating", "anchored", "rich"], components: ["Popover"] },
      { keywords: ["accordion", "collapse", "expand", "faq"], components: ["Accordion"] },
      { keywords: ["checkbox", "check", "toggle option"], components: ["Checkbox"] },
      { keywords: ["switch", "toggle", "on off", "enable"], components: ["Switch"] },
      { keywords: ["slider", "range", "scrubber", "volume"], components: ["Slider"] },
      { keywords: ["calendar", "date", "datepicker", "date picker"], components: ["Calendar"] },
      { keywords: ["breadcrumb", "trail", "path", "location"], components: ["Breadcrumb"] },
      { keywords: ["separator", "divider", "hr", "rule"], components: ["Separator"] },
      { keywords: ["heading", "title", "text", "typography", "font"], components: ["Typography"] },
      { keywords: ["pagination", "pages", "paging", "next prev"], components: ["Pagination"] },
    ];

    const matches = new Map();
    for (const hint of hints) {
      if (hint.keywords.some((kw) => query.includes(kw))) {
        for (const comp of hint.components) {
          matches.set(comp, (matches.get(comp) ?? 0) + 1);
        }
      }
    }

    const sorted = [...matches.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    if (sorted.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No specific component match for "${use_case}".\nAvailable: ${componentNames.join(", ")}`,
          },
        ],
      };
    }

    const lines = [
      `**Suggested useVyre components for "${use_case}":**`,
      "",
      ...sorted.map((name) => {
        const comp = components[name];
        return `- **${name}**: ${comp.description}\n  Import: \`${comp.import}\``;
      }),
    ];

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ── Tool: get_full_context ────────────────────────────────────────────────────

server.tool(
  "get_full_context",
  "Get the complete useVyre AI context — all components, tokens, and rules. Use for system prompt injection.",
  {},
  async () => ({
    content: [{ type: "text", text: claudeContext }],
  })
);

// ── Tool: get_anti_patterns ───────────────────────────────────────────────────

server.tool(
  "get_anti_patterns",
  "Get all known AI hallucination patterns for useVyre components — prop names and values that don't exist.",
  {
    component: z
      .string()
      .optional()
      .describe("Filter by component name. Leave empty for all anti-patterns."),
  },
  async ({ component }) => {
    const rules = component
      ? antiPatterns.rules.filter(
          (r) => r.component.toLowerCase() === component.toLowerCase()
        )
      : antiPatterns.rules;

    if (rules.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: component
              ? `No anti-patterns found for "${component}".`
              : "No anti-patterns found.",
          },
        ],
      };
    }

    const lines = [
      component
        ? `## ${component} — Anti-Patterns`
        : `## All useVyre Anti-Patterns (${rules.length} rules)`,
      "",
      ...rules.map(
        (r) =>
          `- ❌ \`<${r.component} ${r.pattern}>\`\n  Reason: ${r.reason}\n  Fix: ${r.fix}`
      ),
    ];

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ── Tool: get_version_info ────────────────────────────────────────────────────

server.tool(
  "get_version_info",
  "Get the current version of useVyre AI context and which package versions it is valid for.",
  {},
  async () => ({
    content: [
      {
        type: "text",
        text: [
          `## useVyre AI Context — Version Info`,
          ``,
          `**Context version:** ${versionInfo.version}`,
          `**Valid for:** ${versionInfo.validFor.join(", ")}`,
          `**Generated:** ${versionInfo.generatedAt}`,
          ``,
          `**Changelog:**`,
          ...Object.entries(versionInfo.changelog).map(
            ([v, c]) => `- v${v} (${c.date}): ${c.summary}`
          ),
        ].join("\n"),
      },
    ],
  })
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
