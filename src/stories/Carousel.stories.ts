import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { ComposedCarousel } from "./Carousel";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Carousel",
  component: ComposedCarousel,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    itemCount: { control: "number", type: "number" },
    itemsPerPage: { control: "number", type: "number" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    spaceBetweenSlides: { type: "string" },
    scrollPadding: { type: "string" },
    mouseDragging: { type: "boolean" },
    scrollBy: { control: "select", options: ["page", "item"] },
    loop: {
      options: ["infinite", "native", "off"],
      mapping: { infinite: "infinite", native: "native", off: false },
      control: "select",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof ComposedCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    itemsPerPage: 3,
    itemCount: 12,
    spaceBetweenSlides: "16px",
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
