import { ComponentPropsWithoutRef, useContext } from "react";

import { IndexContext, useCarouselContext } from "./context";
import { useCarouselItem } from "./useCarouselItem";
import { mergeProps } from "./utils";

export interface CarouselItemProps extends ComponentPropsWithoutRef<"div"> {
  /** The placement of the item in the carousel */
  index?: number;
}

export function CarouselItem({ index, ...props }: CarouselItemProps) {
  const ctx = useCarouselContext();
  const itemIndex = useContext(IndexContext);

  const { itemProps } = useCarouselItem(
    { index: index ?? itemIndex },
    ctx.carouselState,
  );

  return <div {...mergeProps(itemProps, props)} />;
}
