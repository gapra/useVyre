import { noInvalidVyreProps } from "./rules/no-invalid-vyre-props.js";

const plugin = {
  meta: {
    name: "eslint-plugin-vyre",
    version: "0.1.0",
  },
  rules: {
    "no-invalid-vyre-props": noInvalidVyreProps,
  },
  configs: {},
};

// Flat config (ESLint 9+)
plugin.configs.recommended = {
  name: "vyre/recommended",
  plugins: { vyre: plugin },
  rules: {
    "vyre/no-invalid-vyre-props": "error",
  },
};

// Legacy config (ESLint 8)
plugin.configs["recommended-legacy"] = {
  plugins: ["vyre"],
  rules: {
    "vyre/no-invalid-vyre-props": "error",
  },
};

export default plugin;
export const rules = plugin.rules;
export const configs = plugin.configs;
