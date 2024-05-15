import { defineConfig } from "@pandacss/dev";
import radixColorsPreset from "pandacss-preset-radix-colors";
import typographyPreset from "pandacss-preset-typography";

export default defineConfig({
  presets: [
    radixColorsPreset({
      darkMode: { condition: "@media (prefers-color-scheme: dark)" },
      // colorScales: ["slate", "blue", "amber"],
    }),
    typographyPreset(),
    "@pandacss/dev/presets",
  ],

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./{app,docs,examples,components}/**/*.{js,jsx,ts,tsx,mdx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        fonts: {
          body: { value: "'IBM Plex Sans', sans-serif" },
          mono: { value: "'IBM Plex Mono', monospace" },
        },
        colors: {
          prose: {
            body: {
              value: "{colors.slate.12}",
            },
            heading: {
              value: "{colors.slate.12}",
            },
            lead: {
              value: "{colors.slate.12}",
            },
            link: {
              value: "{colors.blue.11}",
            },
            bold: {
              value: "{colors.slate.12}",
            },
            counter: {
              value: "{colors.slate.11}",
            },
            bullet: {
              value: "{colors.slate.11}",
            },
            hrBorder: {
              value: "{colors.indigo.4}",
            },
            quote: {
              value: "{colors.slate.11}",
            },
            quoteBorder: {
              value: "{colors.slate.6}",
            },
            caption: {
              value: "{colors.slate.11}",
            },
            kbd: {
              value: "{colors.slate.11}",
            },
            kbdShadow: {
              // Expects an RGB value
              value: "0 0 0",
            },
            code: {
              value: "{colors.amber.11}",
            },
            preCode: {
              value: "{colors.slate.12}",
            },
            preBg: {
              value: { base: "{colors.gray.50}", _osDark: "{colors.indigo.2}" },
            },
            thBorder: {
              value: "{colors.slate.6}",
            },
            tdBorder: {
              value: "{colors.slate.6}",
            },
          },
          bodyBg: {
            value: {
              base: "white",
              _osDark: "{colors.indigo.1}",
            },
          },
        },
        // colors: {
        // text: {
        //   value: {
        //     DEFAULT: "{colors.neutral.800}",
        //     _osDark: "{colors.neutral.50}",
        //   },
        // },
        // },
      },
    },
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

  globalCss: {
    extend: {
      html: {
        fontFamily: "body",
        color: "prose.body",
        bg: "bodyBg",
        _motionSafe: {
          scrollBehavior: "smooth",
        },
      },
      code: { fontFamily: "mono" },
      'code[data-theme*=" "], code[data-theme*=" "] span': {
        color: "var(--shiki-light)",
        backgroundColor: "var(--shiki-light-bg)",
        _osDark: {
          color: "var(--shiki-dark)",
          backgroundColor: "var(--shiki-dark-bg)",
        },
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
