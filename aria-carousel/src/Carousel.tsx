"use client";

import { ComponentPropsWithoutRef, useState } from "react";
import { mergeProps } from "@react-aria/utils";
import { CollectionChildren } from "@react-types/shared";

import { Context } from "./context";
import { CarouselOptions, useCarousel } from "./useCarousel";

export interface CarouselProps<T extends object>
  extends Omit<CarouselOptions<T>, "children">,
    ComponentPropsWithoutRef<"div"> {}

export function Carousel<T extends object>({
  children,
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
  ...props
}: CarouselProps<T>) {
  const [carouselChildren, setCarouselChildren] =
    useState<CollectionChildren<T>>();
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
  };
  const [assignRef, carouselState] = useCarousel({
    ...carouselProps,
    children: carouselChildren,
  });

  return (
    <Context.Provider
      value={{
        setCarouselChildren,
        assignRef,
        carouselState,
        carouselProps,
      }}
    >
      <div {...mergeProps(carouselState.rootProps, props)}>{children}</div>
    </Context.Provider>
  );
}
