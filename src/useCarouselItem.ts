import { flatten } from "./internal/utils.js";
import { CarouselState } from "./useCarouselStateFoo.js";
import { useCarousel } from "./useCarouselFoo.js";
import { Node } from "@react-types/shared";

type CarouselProps = ReturnType<typeof useCarousel>;

export interface UseCarouselItemProps<T extends object> extends CarouselProps {
  item: Node<T>;
  index: number;
  itemAriaLabel?: (opts: { currentItem: number; itemCount: number }) => string;
  itemAriaRoleDescription?: string;
}

export function useCarouselItem<T extends object>(
  props: UseCarouselItemProps<T>,
) {
  const {
    index,
    itemAriaLabel = ({ currentItem, itemCount }) =>
      `Item ${currentItem} of ${itemCount}`,
    itemAriaRoleDescription = "description",
    pages,
    activePageIndex,
    snapPointIndexes,
  } = props;

  return {
    carouselItemProps: {
      "data-carousel-item": index,
      inert: pages[activePageIndex]?.includes(index) ? undefined : "true",
      role: "group" as const,
      "aria-label": itemAriaLabel({
        currentItem: (index ?? 0) + 1,
        itemCount: flatten(pages).length ?? 1,
      }),
      "aria-roledescription": itemAriaRoleDescription,
      style: {
        scrollSnapAlign: snapPointIndexes.has(index) ? "start" : undefined,
      },
    },
  };
}
