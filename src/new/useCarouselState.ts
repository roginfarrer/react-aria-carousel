import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  KeyboardEventHandler,
  useRef,
  SetStateAction,
  Dispatch,
  RefObject,
} from "react";
import { useCollection } from "@react-stately/collections";
import { ListCollection } from "@react-stately/list";
import { Node } from "@react-types/shared";
import { scrollIntoView } from "@react-aria/utils";

interface CarouselStateProps {
  ref: RefObject<HTMLElement>;
  orientation?: "vertical" | "horizontal";
  scrollBy?: "page" | "item";
  enableLoopPagination?: boolean;
}

export const useCarouselState = <T extends object>(
  props: CarouselStateProps,
) => {
  const { ref, orientation, scrollBy, enableLoopPagination } = props;

  const factory = useCallback(
    (nodes: Iterable<Node<T>>) => new ListCollection(nodes),
    [],
  );
  const collection = useCollection({}, factory);

  const carouselScrollIntoView = (index: number) => {
    const element = ref.current.querySelector(`[data-key=${index}]`);
    element.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const scrollToNextPage = () => {
    const next = collection.carouselScrollIntoView;
  };

  return {
    scrollIntoView: carouselScrollIntoView,
  };
};
