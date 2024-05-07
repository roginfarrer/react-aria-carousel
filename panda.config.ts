import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./examples/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  utilities: {
    extend: {
      size: {
        transform(value) {
          return { height: value, width: value };
        },
        group: "Width",
        values: "sizes",
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
