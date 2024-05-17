import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

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

  // globalCss: {
  //   extend: {
  //     ".prose": {
  //       "& > * + *": {
  //         mt: "4",
  //       },
  //       li: { mb: "2" },
  //       h1: { textStyle: "5xl", mt: "6" },
  //       h2: { textStyle: "4xl", mt: "6" },
  //       h3: { textStyle: "3xl", mt: "6" },
  //       h4: { textStyle: "2xl", mt: "6" },
  //       "ul li": { listStyleType: "disc" },
  //       "ol li": { listStyleType: "" },
  //       "ol, ul": { ml: "6" },
  //     },
  //   },
  // },

  // The output directory for your css system
  outdir: "styled-system",
});
