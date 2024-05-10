import type { Preview } from "@storybook/react";

import "./styles.css";

const preview: Preview = {
  parameters: {
    sourceLink: "https://github.com/roginfarrer/carousel",
    docs: {
      toc: {
        headingSelector: "h1,h2,h3",
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
