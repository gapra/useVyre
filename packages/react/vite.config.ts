import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

// Builds dist/styles/components.css after every (re)build, combining the design
// tokens (CSS variables the components depend on) with the component styles.
// One import — `@usevyre/react/styles` — now ships everything, so consumers no
// longer have to remember a separate `@usevyre/tokens/css` import (a common
// "components render unstyled" footgun). Runs in both `vite build` and
// `vite build --watch` (dev) so the export is never missing or partial.
function copyStyles() {
  return {
    name: "vyre-copy-styles",
    writeBundle() {
      const tokens = readFileSync(
        resolve(__dirname, "../tokens/dist/vyre.css"),
        "utf8"
      );
      const components = readFileSync(
        resolve(__dirname, "src/styles/components.css"),
        "utf8"
      );
      mkdirSync(resolve(__dirname, "dist/styles"), { recursive: true });
      writeFileSync(
        resolve(__dirname, "dist/styles/components.css"),
        `/* @usevyre/react styles — design tokens + component styles (self-contained) */\n${tokens}\n${components}`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStyles()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        // Mark the whole bundle as a Client Component so the components (33 use
        // hooks) work out of the box in React Server Components / Next.js App
        // Router without consumers adding "use client" themselves. Emitted as
        // the first line, above the imports.
        banner: '"use client";',
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
