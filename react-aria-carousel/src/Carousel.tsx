"use client";

import { ComponentPropsWithoutRef } from "react";

import { Context } from "./context";
import { CarouselOptions, useCarousel } from "./useCarousel";
import { mergeProps } from "./utils";

export interface CarouselProps
  extends Omit<CarouselOptions, "children">,
    ComponentPropsWithoutRef<"div"> {}

export function Carousel({
  children,
  spaceBetweenItems = "16px",
  scrollPadding,
  mouseDragging,
  autoplay,
  autoplayInterval,
  itemsPerPage = 1,
  loop,
  orientation = "horizontal",
  scrollBy = "page",
  initialPages = [],
  onActivePageIndexChange,
  ...props
}: CarouselProps) {
  const carouselProps = {
    spaceBetweenItems,
    scrollPadding,
    mouseDragging,
    autoplay,
    autoplayInterval,
    itemsPerPage,
    loop,
    orientation,
    scrollBy,
    initialPages,
    onActivePageIndexChange,
  };
  const [assignRef, carouselState] = useCarousel(carouselProps);

  return (
    <Context.Provider
      value={{
        assignRef,
        carouselState,
        carouselProps,
      }}
    >
      <div {...mergeProps(carouselState.rootProps, props)}>{children}</div>
    </Context.Provider>
  );
}
