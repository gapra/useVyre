import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

/**
 * Root Vitest config for the useVyre monorepo.
 *
 * Three projects with different environments:
 *
 *  - "contract" (node): the integrity suite under `tests/` — guards that the
 *    AI-facing schema matches the components that ship. Plain Node, no DOM.
 *
 *  - "components" (jsdom): behavior tests under `tests/components/` that
 *    render the BUILT @usevyre/react and assert each component actually does
 *    what the schema promises an agent (data-variant/size, defaults, aria,
 *    loading→disabled). Requires `pnpm -r build` first.
 *
 *  - "components-vue" (jsdom): behavior tests under `tests/components-vue/`
 *    that render the @usevyre/vue components directly from SOURCE (.vue) via
 *    @vitejs/plugin-vue — no build step needed.
 */
export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: "contract",
          environment: "node",
          include: ["tests/*.test.ts"],
        },
      },
      {
        test: {
          name: "components",
          globals: true,
          environment: "jsdom",
          include: ["tests/components/**/*.test.tsx"],
          setupFiles: ["tests/components/setup.ts"],
        },
      },
      {
        plugins: [vue()],
        resolve: {
          // Ensure the .vue SFCs in packages/vue/src resolve a single copy of vue.
          dedupe: ["vue"],
        },
        test: {
          name: "components-vue",
          globals: true,
          environment: "jsdom",
          include: ["tests/components-vue/**/*.test.ts"],
          setupFiles: ["tests/components-vue/setup.ts"],
          server: { deps: { inline: ["@usevyre/vue"] } },
        },
      },
    ],
  },
});
