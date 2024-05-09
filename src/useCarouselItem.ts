import { Node } from "@react-types/shared";

import { Attributes } from "./types";
import { CarouselAria } from "./useCarousel";

export interface CarouselItemOptions<T extends object> {
  item: Node<T>;
}

export interface CarouselItemAria {
  itemProps: Attributes<"div">;
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

  return {
    itemProps: {
      "data-carousel-item": item.index,
      inert: pages[activePageIndex]?.includes(item.index!) ? undefined : "true",
      "aria-hidden": pages[activePageIndex]?.includes(item.index!)
        ? undefined
        : true,
      role: "group",
      // @TODO: should be configurable
      "aria-label": `Item ${item.index! + 1} of ${state.collection.size}`,
      style: {
        scrollSnapAlign: shouldSnap ? "start" : undefined,
      },
    },
  };
}
