import type { Preview } from "@storybook/react";

import "./styles.css";

const preview: Preview = {
  parameters: {
    chromatic: { delay: 300 },
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
