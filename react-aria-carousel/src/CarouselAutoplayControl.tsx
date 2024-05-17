"use client";

import { ComponentPropsWithoutRef } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";

export interface CarouselAutoplayControlProps
  extends ComponentPropsWithoutRef<"button"> {}

export function CarouselAutoplayControl(props: CarouselAutoplayControlProps) {
  const { carouselState } = useCarouselContext();

  return (
    <button
      type="button"
      {...mergeProps(carouselState?.autoplayControlProps, props)}
    />
  );
}
