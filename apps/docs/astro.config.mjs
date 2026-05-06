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
      exclude: ["@vyre/react", "@vyre/vue"],
    },
    ssr: {
      // Allow Vite SSR to process workspace TS source
      noExternal: ["@vyre/react", "@vyre/vue"],
    },
  },
});
