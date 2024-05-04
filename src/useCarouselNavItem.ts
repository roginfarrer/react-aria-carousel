import { flatten } from "./internal/utils.js";
import { UseCarouselResult } from "./useCarouselState.js";

interface UseCarouselNavItemProps {
  index: number;
  isSelected?: boolean;
}

export function useCarouselNavItem(
  props: UseCarouselNavItemProps,
  state: UseCarouselResult & { id: string },
) {
  const itemId = `carousel-${props.index + 1}-${state.id}`;
  const isSelected = props.isSelected ?? state.activePageIndex === props.index;

  return {
    navItemProps: {
      type: "button",
      role: "tab",
      "aria-controls": itemId,
      "aria-labelledby": itemId,
      "aria-posinset": props.index + 1,
      "aria-setsize": flatten(state.pages).length,
      "aria-selected": isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => state.scrollIntoView(props.index),
    },
    isSelected,
  };
}
