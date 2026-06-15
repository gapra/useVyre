import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

// Builds dist/styles/components.css after every (re)build, combining the design
// tokens (CSS variables the components depend on) with the component styles.
// One import — `@usevyre/vue/styles` — now ships everything, so consumers no
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
        `/* @usevyre/vue styles — design tokens + component styles (self-contained) */\n${tokens}\n${components}`
      );
    },
  };
}

export default defineConfig({
  plugins: [vue(), copyStyles()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
      },
    },
  },
});
