import { CarouselAria } from "./useCarousel";
import { Attributes } from "./utils";

export interface CarouselNavItemOptions {
  /** An index of a page in the carousel. */
  index: number;
  /** Whether the page is the active, visible page of the carousel. */
  isSelected?: boolean;
}

export interface CarouselNavItemAria
  extends Required<Pick<CarouselNavItemOptions, "isSelected">> {
  /** Props for the nav item element. */
  navItemProps: Attributes<"button">;
}

export function useCarouselNavItem<T extends object>(
  props: CarouselNavItemOptions,
  state: CarouselAria<T>,
): CarouselNavItemAria {
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
