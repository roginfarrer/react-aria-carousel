"use client";

import { forwardRef, Key, ReactNode, useImperativeHandle, useRef } from "react";

import {
  useCarousel,
  UseCarouselOptions,
  UseCarouselResult,
} from "./useCarousel";
import {
  CarouselContext,
  CarouselContextProvider,
  Item,
} from "./internal/utils";

/**
 * @public
 * @name Carousel
 * @system-props common, layout
 */
export interface CarouselProps<CarouselItem extends Item>
  extends UseCarouselOptions,
    Pick<CarouselContext<CarouselItem>, "snapAnchor" | "items"> {
  /** The UI elements of the Carousel, such as the scroller, navigation, or buttons. */
  children: ReactNode;
  /**
   * Non-visual label for the Carousel that's necessary for the component to be accessible.
   * Should not be used with aria-labelledby.
   */
  "aria-label"?: string;
  /**
   * ID of the element that labels the Carousel.
   * Should not be used with aria-label.
   */
  "aria-labelledby"?: string;
  "aria-roledescription"?: string;
  /**
   * A function that returns a unique key for an item object.
   * @default '(item) => item.key || item.id'
   */
  getItemKey?: (item: CarouselItem) => Key;
}

export interface AriaLabelProps {
  "aria-label": string;
  "aria-labelledby"?: never;
}
export interface AriaLabelledByProps {
  "aria-label"?: never;
  "aria-labelledby": string;
}
export type Label = AriaLabelProps | AriaLabelledByProps;
export type Labelled<T> = Omit<T, keyof Label> & Label;

export type CarouselRef = Readonly<
  Pick<
    UseCarouselResult,
    | "scrollTo"
    | "scrollToPreviousPage"
    | "scrollToNextPage"
    | "scrollIntoView"
    | "refresh"
  > & { element: HTMLElement | null }
>;

const Carousel = forwardRef(function Carousel<CarouselItem extends Item>(
  props: CarouselProps<CarouselItem>,
  ref: React.ForwardedRef<CarouselRef>,
) {
  const {
    children,
    snapAnchor = "item",
    items,
    onActivePageIndexChange,
    scrollBy,
    orientation,
    onScrollPositionChange,
    getItemKey = (item) => (item?.key as Key) || (item?.id as string),
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-roledescription": ariaRoleDescription,
    enableLoopPagination,
  } = props;

  const elementRef = useRef<HTMLElement | null>(null);
  const carousel = useCarousel({
    onScrollPositionChange,
    onActivePageIndexChange,
    scrollBy,
    orientation,
    enableLoopPagination,
  });

  const {
    scrollToPreviousPage,
    scrollToNextPage,
    scrollTo,
    scrollIntoView,
    refresh,
  } = carousel;

  useImperativeHandle(
    ref,
    () => ({
      scrollIntoView,
      scrollTo,
      scrollToNextPage,
      scrollToPreviousPage,
      refresh,
      element: elementRef.current,
    }),
    [refresh, scrollIntoView, scrollTo, scrollToNextPage, scrollToPreviousPage],
  );

  const context: CarouselContext<CarouselItem> = {
    ...carousel,
    enableLoopPagination: Boolean(enableLoopPagination),
    getItemKey,
    items,
    snapAnchor,
  };

  return (
    <CarouselContextProvider value={context}>
      <section
        onKeyDown={carousel.handleRootElKeydown}
        ref={elementRef}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-roledescription={ariaRoleDescription}
      >
        {children}
      </section>
    </CarouselContextProvider>
  );
});

export default Carousel;
