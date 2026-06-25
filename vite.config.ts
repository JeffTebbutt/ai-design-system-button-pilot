import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      outDirs: "dist"
    })
  ],
  publicDir: false,
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom"]
    },
    emptyOutDir: true
  }
});