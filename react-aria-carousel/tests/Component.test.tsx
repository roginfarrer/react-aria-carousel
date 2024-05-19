import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ComposedCarousel } from "./ComposedCarousel";

describe("a11y", () => {
  test("Root container attributes", () => {
    render(<ComposedCarousel />);
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
  });

  test("Carousel scroller element attributes", () => {
    render(<ComposedCarousel />);
    const scroller = screen.getByTestId("scroller");
    expect(scroller).toHaveAttribute("aria-label", "Items Scroller");
    expect(scroller).toHaveAttribute("tabIndex", "0");
    expect(scroller).toHaveAttribute("aria-atomic", "true");
    expect(scroller).toHaveAttribute("aria-live", "off");
    expect(scroller).toHaveAttribute("aria-busy", "false");
    expect(scroller).toHaveAttribute("role", "group");
  });

  test("Carousel item element attributes", async () => {
    render(<ComposedCarousel />);
    const item = screen.getByTestId("item-0");
    expect(item).toHaveAttribute("aria-label", "1 of 4");
    expect(item).toHaveAttribute("role", "group");
    expect(item).toHaveAttribute("aria-roledescription", "carousel item");
    expect(item).not.toHaveAttribute("aria-hidden");

    expect(screen.getByTestId("item-1")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("item-1")).toHaveAttribute("inert", "true");
  });
});
