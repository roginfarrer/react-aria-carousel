import { Attributes } from "./types";
import { CarouselAria } from "./useCarousel";

export interface UseCarouselNavItemProps {
  index: number;
  isSelected?: boolean;
}

export interface CarouselNavItem {
  navItemProps: Attributes<"button">;
  isSelected: boolean;
}

export function useCarouselNavItem<T extends object>(
  props: UseCarouselNavItemProps,
  state: CarouselAria<T>,
): CarouselNavItem {
  // const itemId = genItemId(state.id, props.index);
  const isSelected = props.isSelected ?? state.activePageIndex === props.index;
  let current = props.index + 1,
    setSize = state.pages.length;
  return {
    navItemProps: {
      role: "tab",
      "aria-label": `Go to item ${current} of ${setSize}`,
      "aria-posinset": current,
      "aria-setsize": setSize,
      "aria-selected": isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => state.scrollToPage(props.index),
    },
    isSelected,
  };
}
