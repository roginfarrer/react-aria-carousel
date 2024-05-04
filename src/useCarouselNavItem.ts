import { flatten } from "./internal/utils.js";
import { useCarousel } from "./useCarouselFoo.js";
import { genItemId } from "./utils.js";

type UseCarouselResult = ReturnType<typeof useCarousel>;
interface UseCarouselNavItemProps {
  index: number;
  isSelected?: boolean;
}

export function useCarouselNavItem(
  props: UseCarouselNavItemProps,
  state: UseCarouselResult,
) {
  const itemId = genItemId(state.id, props.index);
  const isSelected = props.isSelected ?? state.activePageIndex === props.index;

  return {
    navItemProps: {
      role: "tab",
      "aria-controls": itemId,
      "aria-labelledby": itemId,
      "aria-posinset": props.index + 1,
      "aria-setsize": flatten(state.pages).length,
      "aria-selected": isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => state.scrollTo(props.index),
    },
    isSelected,
  };
}
