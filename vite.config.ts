import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
