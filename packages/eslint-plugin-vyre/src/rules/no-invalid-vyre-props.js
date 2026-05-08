import { schema } from "@usevyre/ai-context";

const { components } = schema;

// Build a lookup: componentName → { propName → propDef }
const componentPropMap = Object.fromEntries(
  Object.entries(components).map(([name, comp]) => [name, comp.props ?? {}])
);

// Build a lookup for known hallucinated props (prop names that don't exist at all)
const hallucinatedProps = {};
for (const [compName, comp] of Object.entries(components)) {
  for (const ap of comp.antiPatterns ?? []) {
    // e.g. pattern: `color="..."` → prop name is "color"
    const propMatch = ap.pattern.match(/^(\w+)=/);
    if (propMatch) {
      const prop = propMatch[1];
      if (!hallucinatedProps[compName]) hallucinatedProps[compName] = {};
      hallucinatedProps[compName][prop] = ap;
    }
  }
}

export const noInvalidVyreProps = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow invalid prop values and non-existent props on useVyre components",
      category: "Possible Errors",
      recommended: true,
      url: "https://usevyre.com/docs/eslint#no-invalid-vyre-props",
    },
    messages: {
      invalidEnumValue:
        "'{{ value }}' is not a valid value for {{ component }} {{ prop }}. Valid: {{ valid }}",
      hallucinatedProp:
        "'{{ prop }}' prop does not exist on {{ component }}. {{ reason }} → {{ fix }}",
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const componentName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;

        if (!componentName || !components[componentName]) return;

        const propDefs = componentPropMap[componentName] ?? {};
        const hallucinated = hallucinatedProps[componentName] ?? {};

        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute") continue;
          const propName =
            attr.name.type === "JSXIdentifier" ? attr.name.name : null;
          if (!propName) continue;

          // Skip non-vyre props
          if (propName === "className" || propName === "style" || propName === "data-testid" || propName === "ref") continue;

          const propDef = propDefs[propName];

          // Check for hallucinated prop (known non-existent)
          if (!propDef && hallucinated[propName]) {
            const ap = hallucinated[propName];
            context.report({
              node: attr,
              messageId: "hallucinatedProp",
              data: {
                prop: propName,
                component: componentName,
                reason: ap.reason,
                fix: ap.fix,
              },
            });
            continue;
          }

          // Validate enum value
          if (propDef?.values && attr.value) {
            let value = null;
            if (attr.value.type === "Literal") {
              value = attr.value.value;
            } else if (
              attr.value.type === "JSXExpressionContainer" &&
              attr.value.expression.type === "Literal"
            ) {
              value = attr.value.expression.value;
            }

            if (value !== null && !propDef.values.includes(value)) {
              context.report({
                node: attr,
                messageId: "invalidEnumValue",
                data: {
                  value,
                  component: componentName,
                  prop: propName,
                  valid: propDef.values.map(v => `"${v}"`).join(", "),
                },
              });
            }
          }
        }
      },
    };
  },
};
