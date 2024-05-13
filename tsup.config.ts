import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    external: ["react", "react-dom"],
    outDir: "./dist",
    treeshake: true,
    dts: true,
    clean: true,
  },
]);
