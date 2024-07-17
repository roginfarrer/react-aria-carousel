import { ComponentPropsWithoutRef, forwardRef, useContext } from "react";

import { IndexContext, useCarouselContext } from "./context";
import { useCarouselItem } from "./useCarouselItem";
import { mergeProps } from "./utils";

export interface CarouselItemProps extends ComponentPropsWithoutRef<"div"> {
  /** The placement of the item in the carousel */
  index?: number;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem({ index, ...props }, forwardedRef) {
    const ctx = useCarouselContext();
    const itemIndex = useContext(IndexContext);

    const { itemProps } = useCarouselItem(
      { index: index ?? itemIndex },
      ctx.carouselState,
    );

    return <div ref={forwardedRef} {...mergeProps(itemProps, props)} />;
  },
);
