import { resolve } from "path";
import devServer from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "examples/build",
  },
  plugins: [
    react(),
    tsconfigPaths(),
    devServer({
      entry: "./examples/hono.ts",
      exclude: [
        // We need to override this option since the default setting doesn't fit
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false, // This option is buggy, disable it and inject the code manually
    }),
  ],
  // resolve: {
  //   conditions: ["source"],
  //   alias: [
  //     {
  //       find: "styled-system",
  //       replacement: resolve(__dirname, "./styled-system/"),
  //     },
  //   ],
  // },
});
