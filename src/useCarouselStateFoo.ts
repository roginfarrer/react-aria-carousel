import { CollectionStateBase, Node } from "@react-types/shared";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useCollection } from "@react-stately/collections";
import { ListCollection } from "@react-stately/list";
import { flatten } from "./internal/utils.js";

export interface CarouselState<T extends object>
  extends CollectionStateBase<T> {
  pageState: { pages: number[][]; activePageIndex: number };
  updatePageState: Dispatch<
    SetStateAction<{ pages: number[][]; activePageIndex: number }>
  >;
  snapPointIndexes: Set<number>;
}

export interface CarouselProps<T extends object>
  extends CollectionStateBase<T> {
  initialPages?: number[][];
  scrollBy?: "page" | "item";
}

export function useCarouselState<T extends object>(
  props: CarouselProps<T>,
): CarouselState<T> {
  // NOTE: `pages` & `activePageIndex` are modelled as a single state object
  // to ensure they don't become out of sync with one another. (i.e. would rather
  // not implicitly rely on set state batching)
  const [state, setCarouselState] = useState<{
    pages: number[][];
    activePageIndex: number;
  }>({
    pages: props.initialPages,
    activePageIndex: 0,
  });
  const { pages } = state;

  const {
    collection: propCollection,
    children,
    items,
    disabledKeys,
    scrollBy,
  } = props;

  let factory = useCallback(
    (nodes) => new ListCollection(nodes as Iterable<Node<T>>),
    [],
  );
  const collection = useCollection(
    { collection: propCollection, children, items, disabledKeys },
    factory,
  );

  const snapPointIndexes = useMemo(() => {
    if (scrollBy === "item") {
      return new Set(flatten(pages));
    }
    return new Set(pages.map((page) => page[0]));
  }, [pages, scrollBy]);

  return {
    pageState: state,
    updatePageState: setCarouselState,
    collection,
    snapPointIndexes,
  };
}
