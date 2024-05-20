import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

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

export const InfiniteLoop: Story = {
  args: { loop: "infinite" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const prev = canvas.getByLabelText("Previous page");
      const next = canvas.getByLabelText("Next page");
      expect(prev).toBeEnabled();
      expect(next).toBeEnabled();

      userEvent.click(prev);
    });
    await waitFor(async () => {
      const next = canvas.getByLabelText("Next page");
      // Ignore clone at the beginning
      await expect(
        canvas.getAllByLabelText("4 of 4").at(-1),
      ).not.toHaveAttribute("aria-hidden");
      await expect(next).toBeEnabled();
    });
  },
};

export const NativeLoop: Story = {
  args: { loop: "native" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const prev = canvas.getByLabelText("Previous page");
      const next = canvas.getByLabelText("Next page");
      expect(prev).toBeEnabled();
      expect(next).toBeEnabled();

      userEvent.click(prev);
    });
    await waitFor(() => {
      const next = canvas.getByLabelText("Next page");
      // Ignore clone at the beginning
      expect(canvas.getAllByLabelText("4 of 4").at(-1)).not.toHaveAttribute(
        "aria-hidden",
      );
      expect(next).toBeEnabled();
    });
  },
};

export const Autoplay: Story = {
  args: { autoplay: true, autoplayInterval: 500 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByLabelText("Disable autoplay");
    expect(canvas.getByLabelText("1 of 4")).not.toHaveAttribute("aria-hidden");
    await wait(600);
    await waitFor(() => {
      expect(canvas.getByLabelText("1 of 4")).toHaveAttribute("aria-hidden");
      expect(canvas.getByLabelText("2 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
      userEvent.click(btn);
    });
    await wait(1200);
    await waitFor(async () => {
      expect(btn).toHaveAttribute("aria-label", "Enable autoplay");
      await expect(canvas.getByLabelText("1 of 4")).toHaveAttribute(
        "aria-hidden",
      );
      await expect(canvas.getByLabelText("2 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
      await expect(canvas.getByLabelText("3 of 4")).toHaveAttribute(
        "aria-hidden",
      );
    });
  },
};

const wait = (time: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
};
