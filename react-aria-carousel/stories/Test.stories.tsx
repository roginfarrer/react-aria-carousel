import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

import { ComposedCarousel } from "./ComposedCarousel";

const meta: Meta<typeof ComposedCarousel> = {
  component: ComposedCarousel,
  tags: [],
};

export default meta;

type Story = StoryObj<typeof ComposedCarousel>;

export const Basic: Story = {
  args: {
    onActivePageIndexChange: fn(),
  },
  tags: [],
  play: async ({ canvasElement, args }) => {
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
      expect(args.onActivePageIndexChange).toHaveBeenCalledWith({ index: 1 });
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

    expect(args.onActivePageIndexChange).toHaveBeenCalledTimes(1);
  },
};

export const InfiniteLoop: Story = {
  args: { loop: "infinite", onActivePageIndexChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      const prev = canvas.getByLabelText("Previous page");
      const next = canvas.getByLabelText("Next page");
      expect(prev).toBeEnabled();
      expect(next).toBeEnabled();

      userEvent.click(prev);
    });
    await waitFor(
      async () => {
        const next = canvas.getByLabelText("Next page");
        // Ignore clone at the beginning
        await expect(
          canvas.getAllByLabelText("4 of 4").at(-1),
        ).not.toHaveAttribute("aria-hidden");
        await expect(next).toBeEnabled();
        await expect(args.onActivePageIndexChange).toHaveBeenLastCalledWith({
          index: 3,
        });
      },
      // Timeout needed because of how the "scrollend" handler called
      // Instead of using the scrollend event, we're using the scorll event
      // with a timer to check if scrolling has stopped
      { timeout: 2000 },
    );
    expect(args.onActivePageIndexChange).toHaveBeenCalledTimes(1);
  },
};

export const NativeLoop: Story = {
  args: { loop: "native", onActivePageIndexChange: fn() },
  play: async ({ canvasElement, args }) => {
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
      expect(args.onActivePageIndexChange).toHaveBeenCalledWith({
        index: 3,
      });
      // Ignore clone at the beginning
      expect(canvas.getAllByLabelText("4 of 4").at(-1)).not.toHaveAttribute(
        "aria-hidden",
      );
      expect(next).toBeEnabled();
    });
    expect(args.onActivePageIndexChange).toHaveBeenCalledTimes(1);
  },
};

export const Autoplay: Story = {
  args: {
    autoplay: true,
    autoplayInterval: 500,
    onActivePageIndexChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByLabelText("Disable autoplay");
    await waitFor(() => {
      expect(canvas.getByLabelText("1 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
    });

    await wait(args.autoplayInterval! + 100);
    await waitFor(() => {
      expect(args.onActivePageIndexChange).toHaveBeenLastCalledWith({
        index: 1,
      });
      expect(canvas.getByLabelText("1 of 4")).toHaveAttribute("aria-hidden");
      expect(canvas.getByLabelText("2 of 4")).not.toHaveAttribute(
        "aria-hidden",
      );
      userEvent.click(btn);
    });

    await wait((args.autoplayInterval! + 100) * 2);
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

    expect(args.onActivePageIndexChange).toHaveBeenCalledTimes(1);
  },
};

const wait = (time: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
};
