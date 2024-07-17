"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";

export interface CarouselButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "dir"> {
  /** Direction that the carousel should scroll when clicked. */
  dir: "next" | "prev";
}

export const CarouselButton = forwardRef<
  HTMLButtonElement,
  CarouselButtonProps
>(function CarouselButton({ dir, ...props }, forwardedRef) {
  const { carouselState } = useCarouselContext();

  const buttonProps =
    dir === "prev"
      ? carouselState?.prevButtonProps
      : carouselState?.nextButtonProps;

  return (
    <button
      ref={forwardedRef}
      type="button"
      {...mergeProps(buttonProps, props)}
    />
  );
});
