import { noInvalidVyreProps } from "./rules/no-invalid-vyre-props.js";
import { noInlineLayoutStyles } from "./rules/no-inline-layout-styles.js";

const plugin = {
  meta: {
    name: "@usevyre/eslint-plugin",
    version: "0.1.0",
  },
  rules: {
    "no-invalid-vyre-props": noInvalidVyreProps,
    "no-inline-layout-styles": noInlineLayoutStyles,
  },
  configs: {},
};

// Flat config (ESLint 9+)
plugin.configs.recommended = {
  name: "vyre/recommended",
  plugins: { vyre: plugin },
  rules: {
    "vyre/no-invalid-vyre-props": "error",
    "vyre/no-inline-layout-styles": "warn",
  },
};

// Legacy config (ESLint 8)
plugin.configs["recommended-legacy"] = {
  plugins: ["vyre"],
  rules: {
    "vyre/no-invalid-vyre-props": "error",
    "vyre/no-inline-layout-styles": "warn",
  },
};

export default plugin;
export const rules = plugin.rules;
export const configs = plugin.configs;
