import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, userEvent, waitFor, within } from "@storybook/test";

import { ComposedCarousel } from "./ComposedCarousel";

const meta: Meta<typeof ComposedCarousel> = {
  component: ComposedCarousel,
  tags: [],
};

export default meta;

type Story = StoryObj<typeof ComposedCarousel>;

export const Basic: Story = {
  tags: [],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      // Test hidden attributes
      expect(canvas.getByLabelText("1 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
      expect(canvas.getByLabelText("2 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(canvas.getByLabelText("3 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(canvas.getByLabelText("4 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    // After scrolling to the next item, the second item is visible
    // others are not
    canvas.getByLabelText("2 of 4").scrollIntoView();
    await waitFor(() => {
      expect(canvas.getByLabelText("1 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(canvas.getByLabelText("2 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
      expect(canvas.getByLabelText("3 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(canvas.getByLabelText("4 of 4")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  },
};
