import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { mkdirSync, copyFileSync } from "fs";

// Copies the component stylesheet into dist/styles after every (re)build.
// Runs in both `vite build` and `vite build --watch` (dev), so the
// "@usevyre/react/styles" export is never missing — unlike a separate
// `cp` step that only runs in the full build script.
function copyStyles() {
  return {
    name: "vyre-copy-styles",
    writeBundle() {
      mkdirSync(resolve(__dirname, "dist/styles"), { recursive: true });
      copyFileSync(
        resolve(__dirname, "src/styles/components.css"),
        resolve(__dirname, "dist/styles/components.css")
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
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
