import { Node } from "@react-types/shared";

import { Attributes } from "./types";
import { CarouselAria } from "./useCarousel";

export interface CarouselItemProps<T extends object> {
  item: Node<T>;
}

export interface CarouselItem {
  itemProps: Attributes<"div">;
}

export function useCarouselItem<T extends object>(
  props: CarouselItemProps<T>,
  state: CarouselAria<T>,
): CarouselItem {
  const { item } = props;
  const { pages, activePageIndex } = state;

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
    },
  };
}
