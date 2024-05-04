import { CollectionStateBase, Node } from "@react-types/shared";
import { useCollection } from "@react-stately/collections";
import { useCallback } from "react";
import { ListCollection } from "@react-stately/list";
import { flatten } from "./internal/utils.js";

export interface CarouselNavProps<T extends object>
  extends CollectionStateBase<T> {}

export function useCarouselNav<T extends object>(props: CarouselNavProps<T>) {
  let factory = useCallback(
    (nodes) => new ListCollection(nodes as Iterable<Node<T>>),
    [],
  );
  const collection = useCollection(props, factory);

  return {
    navProps: {
      role: "tablist",
    },
    collection,
  };
}

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
