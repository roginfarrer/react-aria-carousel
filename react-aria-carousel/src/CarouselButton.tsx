"use client";

import { ComponentPropsWithoutRef } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";

export interface CarouselButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "dir"> {
  /** Direction that the carousel should scroll when clicked. */
  dir: "next" | "prev";
}

export function CarouselButton({ dir, ...props }: CarouselButtonProps) {
  const { carouselState } = useCarouselContext();

  const buttonProps =
    dir === "prev"
      ? carouselState?.prevButtonProps
      : carouselState?.nextButtonProps;

  return <button type="button" {...mergeProps(buttonProps, props)} />;
}
