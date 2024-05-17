"use client";

import { ComponentPropsWithoutRef, useEffect } from "react";
import { CollectionChildren } from "@react-types/shared";

import { useCarouselContext } from "./context";
import { CarouselAria } from "./useCarousel";
import { CarouselItemOptions, useCarouselItem } from "./useCarouselItem";
import { mergeProps } from "./utils";

export interface CarouselScrollerProps<T extends object>
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * The collection of carousel items
   * @see https://react-spectrum.adobe.com/react-aria/collections.html
   */
  children: CollectionChildren<T>;
}

export function CarouselScroller<T extends object>(
  props: CarouselScrollerProps<T>,
) {
  const context = useCarouselContext();
  const { assignRef, setCarouselChildren, carouselState } = context;

  useEffect(() => {
    setCarouselChildren(props.children);
  }, [props.children, setCarouselChildren]);

  return (
    <div
      ref={assignRef}
      {...mergeProps(carouselState?.scrollerProps, props)}
      style={{ ...carouselState?.scrollerProps.style, ...props?.style }}
    >
      {[...(carouselState?.collection || [])].map((item) => (
        <CarouselItem key={item.key} item={item} state={carouselState!} />
      ))}
    </div>
  );
}

function CarouselItem<T extends object>(
  props: CarouselItemOptions<T> & {
    state: CarouselAria<T>;
  },
) {
  const { item, state } = props;
  const { itemProps } = useCarouselItem(props, state);

  return <div {...itemProps}>{item.rendered}</div>;
}
