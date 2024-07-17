"use client";

import * as React from "react";
import { ComponentPropsWithoutRef, ReactElement } from "react";

import { IndexContext, useCarouselContext } from "./context";
import { mergeProps, useMergedRef } from "./utils";

export interface CarouselScrollerProps<T>
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * The data with which each item should be derived.
   */
  items?: Array<T>;
  /**
   * The collection of carousel items.
   */
  children:
    | ReactElement
    | ReactElement[]
    | ((item: T, index: number) => ReactElement);
}

function _CarouselScroller<T>(
  { children, items, ...props }: CarouselScrollerProps<T>,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const context = useCarouselContext();
  const { assignRef, carouselState } = context;
  const ref = useMergedRef(assignRef, forwardedRef);

  const kids = typeof children === "function" ? items!.map(children) : children;

  return (
    <div
      ref={ref}
      {...mergeProps(carouselState?.scrollerProps, props)}
      style={{ ...carouselState?.scrollerProps.style, ...props?.style }}
    >
      {React.Children.map(kids, (child, index) => (
        <IndexContext.Provider value={index}>{child}</IndexContext.Provider>
      ))}
    </div>
  );
}

export const CarouselScroller = React.forwardRef(_CarouselScroller) as <T>(
  props: CarouselScrollerProps<T> & { ref: React.ForwardedRef<HTMLElement> },
) => JSX.Element;
