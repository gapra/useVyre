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
    resolve: {
      // Deduplicate React — guards against two React copies being loaded when
      // the workspace @usevyre/react is resolved from a nested node_modules.
      dedupe: ["react", "react-dom"],
    },
  },
});

// NOTE: this config previously carried optimizeDeps.exclude/include and
// ssr.noExternal for @usevyre/react|vue. Those were Vite 6/7-era workarounds
// (forcing resolution from TS source, and pre-bundling the JSX runtimes to
// avoid a "jsxDEV is not a function" crash in dev). Astro 7 ships Vite 8,
// which replaces Rollup with Rolldown — and Rolldown does NOT honour
// optimizeDeps.exclude for workspace packages, so those options actively broke
// the build ("failed to resolve import @usevyre/react"). Vite 8 resolves the
// workspace packages correctly on its own. Do not reinstate them.
