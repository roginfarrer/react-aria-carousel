import { flatten } from "./internal/utils.js";
import { useCarousel } from "./useCarouselFoo.js";
import { genItemId } from "./utils.js";

type CarouselProps = ReturnType<typeof useCarousel>;

export interface UseCarouselItemProps extends CarouselProps {
  index: number;
  id: string;
  itemAriaLabel?: (opts: { currentItem: number; itemCount: number }) => string;
  itemAriaRoleDescription?: string;
}

export function useCarouselItem(props: UseCarouselItemProps) {
  const {
    index,
    id,
    itemAriaLabel = ({ currentItem, itemCount }) =>
      `Item ${currentItem} of ${itemCount}`,
    itemAriaRoleDescription = "description",
    pages,
    activePageIndex,
    snapPointIndexes,
  } = props;

  return {
    carouselItemProps: {
      id: genItemId(id, index),
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
