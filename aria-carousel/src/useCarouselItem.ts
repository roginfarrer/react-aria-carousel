"use client";

import { Node } from "@react-types/shared";

import { CarouselAria } from "./useCarousel";
import { Attributes } from "./utils";

export interface CarouselItemOptions<T extends object> {
  /** An item in the collection of carousel items */
  item: Node<T>;
}

export interface CarouselItemAria {
  /** Props for the item element */
  readonly itemProps: Attributes<"div">;
}

export function useCarouselItem<T extends object>(
  props: CarouselItemOptions<T>,
  state: CarouselAria<T>,
): CarouselItemAria {
  const { item } = props;
  const { pages, activePageIndex, scrollBy, itemsPerPage } = state;
  const actualItemsPerPage = Math.floor(itemsPerPage);
  const shouldSnap =
    scrollBy === "item" ||
    (item.index! + actualItemsPerPage) % actualItemsPerPage === 0;
  const label =
    item["aria-label"] || `${item.index! + 1} of ${state.collection.size}`;
  const isInert = pages[activePageIndex]?.includes(item.index!);

  return {
    itemProps: {
      "data-carousel-item": item.index,
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
