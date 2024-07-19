"use client";

import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";

export interface CarouselAutoplayControlProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  children:
    | ReactNode
    | ((props: { autoplayUserPreference: boolean }) => ReactNode);
}

export const CarouselAutoplayControl = forwardRef<
  HTMLButtonElement,
  CarouselAutoplayControlProps
>(function CarouselAutoplayControl({ children, ...props }, forwardedRef) {
  const { carouselState } = useCarouselContext();

  return (
    <button
      type="button"
      ref={forwardedRef}
      {...mergeProps(carouselState?.autoplayControlProps, props)}
    >
      {typeof children === "function"
        ? children({
            autoplayUserPreference: carouselState.autoplayUserPreference,
          })
        : children}
    </button>
  );
});
