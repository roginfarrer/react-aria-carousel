"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";

import { Context } from "./context";
import { CarouselOptions, useCarousel } from "./useCarousel";
import { mergeProps } from "./utils";

export interface CarouselProps
  extends Omit<CarouselOptions, "children">,
    ComponentPropsWithoutRef<"div"> {}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel(
    {
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
    },
    ref,
  ) {
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
        <div {...mergeProps(carouselState.rootProps, props)} ref={ref}>
          {children}
        </div>
      </Context.Provider>
    );
  },
);
