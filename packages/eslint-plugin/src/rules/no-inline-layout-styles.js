import { schema } from "@usevyre/ai-context";

const { components } = schema;

// useVyre component names — these legitimately accept `style` as a
// documented escape hatch (especially Box), so we never flag them.
const VYRE_COMPONENTS = new Set(Object.keys(components));

const FLEX_VALUES = new Set(["flex", "inline-flex"]);
const GRID_VALUES = new Set(["grid", "inline-grid"]);

/**
 * Pull a static string value out of an object-property value node.
 * Returns null for anything dynamic (variables, calls, etc.).
 */
function staticString(node) {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

/** Does this style object literal set a flex/grid display? → "flex" | "grid" | null */
function layoutKind(objExpr) {
  if (!objExpr || objExpr.type !== "ObjectExpression") return null;
  for (const prop of objExpr.properties) {
    if (prop.type !== "Property" || prop.computed) continue;
    const key =
      prop.key.type === "Identifier"
        ? prop.key.name
        : prop.key.type === "Literal"
          ? prop.key.value
          : null;
    if (key !== "display") continue;
    const val = staticString(prop.value);
    if (val == null) return null;
    if (FLEX_VALUES.has(val)) return "flex";
    if (GRID_VALUES.has(val)) return "grid";
  }
  return null;
}

export const noInlineLayoutStyles = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow inline display:flex / display:grid styles — use the Stack and Grid layout primitives instead",
      category: "Best Practices",
      recommended: true,
      url: "https://usevyre.com/docs/ai-tooling/eslint-plugin#no-inline-layout-styles",
    },
    messages: {
      useStack:
        "Avoid inline display:flex. Use <Stack> from @usevyre/react instead — its gap/align/justify are design tokens, not magic numbers.",
      useGrid:
        "Avoid inline display:grid. Use <Grid> from @usevyre/react instead — columns and gap are design tokens, not raw values.",
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    return {
      JSXAttribute(node) {
        const propName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (propName !== "style") return;

        // style={{ ... }} only — ignore style="..." strings and spreads/vars
        if (
          !node.value ||
          node.value.type !== "JSXExpressionContainer" ||
          node.value.expression.type !== "ObjectExpression"
        ) {
          return;
        }

        const kind = layoutKind(node.value.expression);
        if (!kind) return;

        // Don't flag useVyre components — Box exposes `style` as a
        // documented, intentional escape hatch.
        const opening = node.parent;
        const elName =
          opening &&
          opening.type === "JSXOpeningElement" &&
          opening.name.type === "JSXIdentifier"
            ? opening.name.name
            : null;
        if (elName && VYRE_COMPONENTS.has(elName)) return;

        context.report({
          node,
          messageId: kind === "flex" ? "useStack" : "useGrid",
        });
      },
    };
  },
};
