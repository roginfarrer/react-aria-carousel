"use client";

import * as React from "react";
import { ComponentPropsWithoutRef, ReactElement } from "react";

import { IndexContext, useCarouselContext } from "./context";
import { mergeProps } from "./utils";

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

export function CarouselScroller<T>({
  children,
  items,
  ...props
}: CarouselScrollerProps<T>) {
  const context = useCarouselContext();
  const { assignRef, carouselState } = context;

  const kids = typeof children === "function" ? items!.map(children) : children;

  return (
    <div
      ref={assignRef}
      {...mergeProps(carouselState?.scrollerProps, props)}
      style={{ ...carouselState?.scrollerProps.style, ...props?.style }}
    >
      {React.Children.map(kids, (child, index) => (
        <IndexContext.Provider value={index}>{child}</IndexContext.Provider>
      ))}
    </div>
  );
}
