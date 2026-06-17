import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vue  from "@astrojs/vue";

export default defineConfig({
  integrations: [react(), vue()],
  site: "https://usevyre.com",
  output: "static",
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
