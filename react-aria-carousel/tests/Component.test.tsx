import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import {
  Carousel,
  CarouselAutoplayControl,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "../src";
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

  test("Carousel item element attributes", () => {
    render(<ComposedCarousel />);
    const item = screen.getByTestId("item-0");
    expect(item).toHaveAttribute("aria-label", "1 of 4");
    expect(item).toHaveAttribute("role", "group");
    expect(item).toHaveAttribute("aria-roledescription", "carousel item");
    expect(item).not.toHaveAttribute("aria-hidden");

    expect(screen.getByTestId("item-1")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("item-1")).toHaveAttribute("inert", "true");
  });

  test("Carousel tablist element attributes", () => {
    render(<ComposedCarousel />);
    const item = screen.getByRole("tablist");
    expect(item).toHaveAttribute(
      "aria-controls",
      screen.getByTestId("scroller").getAttribute("id"),
    );
    expect(item).toHaveAttribute("aria-orientation", "horizontal");
    expect(item).toHaveAttribute("aria-label", "Carousel navigation");
  });

  test("Carousel tab element attributes", () => {
    render(<ComposedCarousel />);
    const item = screen.getAllByRole("tab")[0];
    expect(item).toHaveAttribute("aria-label", "Go to item 1 of 4");
    expect(item).toHaveAttribute("aria-posinset", "1");
    expect(item).toHaveAttribute("aria-setsize", "4");
    expect(item).toHaveAttribute("aria-selected", "true");
    expect(item).toHaveAttribute("tabIndex", "0");

    const secondItem = screen.getAllByRole("tab")[1];
    expect(secondItem).toHaveAttribute("aria-label", "Go to item 2 of 4");
    expect(secondItem).toHaveAttribute("aria-posinset", "2");
    expect(secondItem).toHaveAttribute("aria-setsize", "4");
    expect(secondItem).toHaveAttribute("aria-selected", "false");
    expect(secondItem).toHaveAttribute("tabIndex", "-1");
  });

  test("Carousel Autoplay element attributes", () => {
    render(<ComposedCarousel />);
    const btn = screen.getByTestId("autoplay");
    expect(btn).toHaveAttribute("inert", "true");
    expect(btn).toHaveAttribute("aria-label", "Enable autoplay");
    expect(btn).toHaveAttribute(
      "aria-controls",
      screen.getByTestId("scroller").getAttribute("id"),
    );
  });

  test("Carousel next btn element attributes", () => {
    render(<ComposedCarousel />);
    const btn = screen.getByLabelText("Next page");
    expect(btn).toHaveAttribute(
      "aria-controls",
      screen.getByTestId("scroller").getAttribute("id"),
    );
    expect(btn).toHaveAttribute("data-next-button");
    expect(btn).not.toHaveAttribute("aria-disabled");
  });

  test("Carousel next btn element attributes", () => {
    render(<ComposedCarousel />);
    const btn = screen.getByLabelText("Previous page");
    expect(btn).toHaveAttribute(
      "aria-controls",
      screen.getByTestId("scroller").getAttribute("id"),
    );
    expect(btn).toHaveAttribute("data-prev-button");
    expect(btn).toHaveAttribute("aria-disabled");
  });
});

test("ref access", () => {
  const rootRef = vi.fn();
  const scrollerRef = vi.fn();
  const prevButtonRef = vi.fn();
  const nextButtonRef = vi.fn();
  const itemRef = vi.fn();
  const tablistRef = vi.fn();
  const tabRef = vi.fn();
  const autoplayControlRef = vi.fn();
  render(
    <Carousel ref={rootRef}>
      <CarouselAutoplayControl ref={autoplayControlRef}>
        Toggle autoplay
      </CarouselAutoplayControl>
      <CarouselButton dir="prev" ref={prevButtonRef} />
      <CarouselButton dir="next" ref={nextButtonRef} />
      <CarouselScroller ref={scrollerRef}>
        <CarouselItem ref={itemRef} />
      </CarouselScroller>
      <CarouselTabs ref={tablistRef}>
        {({ index }) => <CarouselTab ref={tabRef} index={index} />}
      </CarouselTabs>
    </Carousel>,
  );

  expect(rootRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(scrollerRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(prevButtonRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(nextButtonRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(itemRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(tablistRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(tabRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(true);
  expect(autoplayControlRef.mock.calls.at(-1)[0] instanceof HTMLElement).toBe(
    true,
  );
});
