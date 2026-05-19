import { defineConfig } from "vitest/config";

/**
 * Root Vitest config for the useVyre monorepo.
 *
 * Two projects with different environments:
 *
 *  - "contract" (node): the integrity suite under `tests/` — guards that the
 *    AI-facing schema matches the components that ship. Plain Node, no DOM.
 *
 *  - "components" (jsdom): behavior tests under `tests/components/` that
 *    render the BUILT @usevyre/react and assert each component actually does
 *    what the schema promises an agent (data-variant/size, defaults, aria,
 *    loading→disabled). Requires `pnpm -r build` first.
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
    ],
  },
});
