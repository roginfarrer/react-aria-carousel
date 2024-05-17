"use client";

import { CarouselAria } from "./useCarousel";
import { Attributes } from "./utils";

export interface CarouselItemOptions {
  /** The index placement of the item within the list of carousel items */
  index: number;
}

export interface CarouselItemAria {
  /** Props for the item element */
  readonly itemProps: Attributes<"div">;
}

export function useCarouselItem(
  props: CarouselItemOptions,
  state: CarouselAria,
): CarouselItemAria {
  const { index } = props;
  const {
    pages = [],
    activePageIndex,
    scrollBy = "page",
    itemsPerPage = 1,
  } = state;
  const actualItemsPerPage = Math.floor(itemsPerPage);
  const shouldSnap =
    scrollBy === "item" ||
    (index! + actualItemsPerPage) % actualItemsPerPage === 0;
  const itemCount = pages?.flat().length;
  const label = itemCount ? `${index! + 1} of ${itemCount}` : undefined;
  const isInert = pages?.[activePageIndex]?.includes(index!);

  return {
    itemProps: {
      "data-carousel-item": index,
      inert: isInert ? undefined : "true",
      "aria-hidden": isInert ? undefined : true,
      "aria-roledescription": "carousel item",
      "aria-label": label,
      style: {
        scrollSnapAlign: shouldSnap ? "start" : undefined,
      },
    },
  };
}
