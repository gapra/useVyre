import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vue  from "@astrojs/vue";

export default defineConfig({
  integrations: [react(), vue()],
  site: "https://usevyre.com",
  output: "static",
  // The 5 chart components are documented as sections on a single /charts page.
  // Keep the old per-chart URLs alive by redirecting them to the matching anchor.
  redirects: {
    "/docs/components/line-chart":  "/docs/components/charts#line-chart",
    "/docs/components/area-chart":  "/docs/components/charts#area-chart",
    "/docs/components/bar-chart":   "/docs/components/charts#bar-chart",
    "/docs/components/pie-chart":   "/docs/components/charts#pie-chart",
    "/docs/components/sparkline":   "/docs/components/charts#sparkline",
  },
  vite: {
    // Prevent Vite from pre-bundling workspace packages —
    // let it resolve them directly from TypeScript source.
    optimizeDeps: {
      exclude: ["@usevyre/react", "@usevyre/vue"],
      // Force the React JSX runtimes to be pre-bundled in dev mode. Without this,
      // Astro 6 / Vite 7 optimizes them alongside the prebuilt (production)
      // @usevyre/react dist and bakes NODE_ENV=production into react/jsx-dev-runtime,
      // leaving jsxDEV undefined → dev demos crash with "jsxDEV is not a function".
      include: ["react/jsx-dev-runtime", "react/jsx-runtime", "react", "react-dom"],
    },
    ssr: {
      // Allow Vite SSR to process workspace TS source
      noExternal: ["@usevyre/react", "@usevyre/vue"],
    },
    resolve: {
      // Deduplicate React — prevents two React copies when @usevyre/react
      // source is processed via /@fs/ and resolves its own packages/react/node_modules/react
      dedupe: ["react", "react-dom"],
    },
  },
});
