"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";

export interface CarouselAutoplayControlProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  children:
    | ReactNode
    | ((props: { autoplayUserPreference: boolean }) => ReactNode);
}

export function CarouselAutoplayControl({
  children,
  ...props
}: CarouselAutoplayControlProps) {
  const { carouselState } = useCarouselContext();

  return (
    <button
      type="button"
      {...mergeProps(carouselState?.autoplayControlProps, props)}
    >
      {typeof children === "function"
        ? children({
            autoplayUserPreference: carouselState.autoplayUserPreference,
          })
        : children}
    </button>
  );
}
