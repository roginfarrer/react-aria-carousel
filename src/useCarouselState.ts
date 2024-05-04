import { useEffect, useMemo, useState, useCallback, useId } from "react";

import { useReducedMotion } from "@mantine/hooks";

import { useSafeLayoutEffect } from "./utils/useSafeLayoutEffect.js";
import { useResizeObserver } from "./utils/useResizeObserver.js";
import { useCallbackRef } from "./utils/useCallbackRef.js";

import {
  assert,
  getEffectiveScrollSpacing,
  getOffsetRect,
} from "./internal/dimensions.js";
import { flatten } from "./internal/utils.js";
// import { useCarouselElementRefs } from "./internal/utils.js";
import { useCollection } from "@react-stately/collections";
import { ListCollection } from "@react-stately/list";
import { Collection, CollectionStateBase, Node } from "@react-types/shared";
// import { useRefs } from "./carousel-context.js";

interface ScrollOpts {
  /**
   * If false, will jump to the provided page without scrolling animation
   * @default true
   */
  animate?: boolean;
}

type CarouselPaginate = (opts?: ScrollOpts & { loop?: boolean }) => number;

/**
 * @public
 * @name useCarousel
 */
export interface UseCarouselResult<T extends object> {
  /** The page in view */
  readonly activePageIndex: number;
  /**
   * The items of the carousel, by index, that the carousel should snap to.
   * Changes based on the number of slides in view.
   */
  readonly snapPointIndexes: Set<number>;
  /** An array representation of each snappable segment of the carousel. */
  readonly pages: number[][];
  /** Scroll to the previous page */
  readonly scrollToPreviousPage: CarouselPaginate;
  /** Scroll to the next page */
  readonly scrollToNextPage: CarouselPaginate;
  /** Scroll to the provided page by index */
  readonly scrollTo: (pageIndex: number, options?: ScrollOpts) => void;
  /** Manually trigger the carousel to recalculate the pages and activePageIndex */
  readonly refresh: () => void;
  /** Assigns the root scrolling element */
  readonly assignScrollerEl: (el: HTMLElement | null) => void;
  /** The root scrolling element */
  readonly scrollerEl: HTMLElement | null;
  /** If true, the carousel smooth-scrolling using a JS polyfill */
  // readonly isPolyfillScrolling: boolean;
  /**
   * Scroll to the provided page, by index, until it's in view.
   * Will not scroll if the page is already in view.
   */
  readonly scrollIntoView: (pageIndex: number, opts?: ScrollOpts) => void;
  /** A coarse representation of the scroll position */
  readonly scrollPosition: "start" | "end" | "middle";
  /** Horizontal or vertical carousel */
  readonly orientation: "vertical" | "horizontal";
  collection: Collection<Node<T>>;
  id: string;
  /** Ref assignment handlers */
  // readonly refs: ReturnType<typeof useCarouselElementRefs>[0];
  // readonly setRefs: ReturnType<typeof useCarouselElementRefs>[1];
}

export interface UseCarouselStateOptions<T extends object>
  extends CollectionStateBase<T> {
  /**
   * The direction of the carousel
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Describes the initial pagination of the carousel, useful for SSR k
   * @default []
   */
  initialPages?: number[][];
  /**
   * Handler called when the activePageIndex changes
   */
  onActivePageIndexChange?: (idx: number) => void;
  /**
   * If 'page', the carousel will scroll by the number of items in view.
   * If 'item', the carousel will scroll by each individual item.
   * @default 'page'
   */
  scrollBy?: "page" | "item";
  /** Handler called when the scroll position changes */
  onScrollPositionChange?: (pos: "start" | "middle" | "end") => void;
  /** @default false */
  enableLoopPagination?: boolean;
  // state: { pages: number[][]; activePageIndex: number };
  // setState: Dispatch<
  //   SetStateAction<{ pages: number[][]; activePageIndex: number }>
  // >;
  // setState: <State = { pages: number[][]; activePageIndex: number }>(
  //   state: State,
  // ) => State;
  // collection: ListCollection<T>;
}

export const useCarouselState = <T extends object>(
  options: UseCarouselStateOptions<T> = {},
): UseCarouselResult<T> => {
  const {
    orientation = "horizontal",
    onActivePageIndexChange = () => {},
    scrollBy = "page",
    onScrollPositionChange,
    enableLoopPagination = false,
    initialPages = [],
    collection: propCollection,
    children,
    items,
    disabledKeys,
    // state,
    // setState: bareSetCarouselState,
  } = options;

  const prefersReducedMotion = useReducedMotion();

  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
  const dimension = orientation === "horizontal" ? "width" : "height";
  const scrollDimension =
    orientation === "horizontal" ? "scrollWidth" : "scrollHeight";
  const clientDimension =
    orientation === "horizontal" ? "clientWidth" : "clientHeight";
  const nearSidePos = orientation === "horizontal" ? "left" : "top";
  const farSidePos = orientation === "horizontal" ? "right" : "bottom";
  const scrollPos = orientation === "horizontal" ? "scrollLeft" : "scrollTop";

  let factory = useCallback(
    (nodes) => new ListCollection(nodes as Iterable<Node<T>>),
    [],
  );
  const collection = useCollection(
    { collection: propCollection, children, items, disabledKeys },
    factory,
  );

  const [scrollPosition, setScrollPosition] = useState<
    "start" | "middle" | "end"
  >("start");

  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  // const refs = useRefs();
  // const [refs, setRefs] = useCarouselElementRefs();

  // NOTE: `pages` & `activePageIndex` are modelled as a single state object
  // to ensure they don't become out of sync with one another. (i.e. would rather
  // not implicitly rely on set state batching)
  const [state, bareSetCarouselState] = useState<{
    pages: number[][];
    activePageIndex: number;
  }>({
    pages: initialPages,
    activePageIndex: 0,
  });

  const { pages, activePageIndex } = state;

  const onPageChange = useCallbackRef(onActivePageIndexChange);

  const setCarouselState = useCallback(
    (args: typeof state) => {
      bareSetCarouselState(args);
      onPageChange?.(args.activePageIndex);
    },
    [onPageChange, bareSetCarouselState],
  );

  const refreshActivePage = useCallback(
    (newPages: number[][]) => {
      if (!scrollEl) return;

      // We don't want to use this when scrollBy === 'item'
      // This edge case was from the original project, which didn't
      // support paginating by a single item when multiple are visible.
      // Doing this would short circuit and override the correct activePageIndex
      //
      // E.g., here's a multi item carousel:
      //
      // [ 15, 16, 17 ]
      //
      // This pathway would make the activePageIndex 17, when it should be 15
      if (scrollBy === "page") {
        // https://excalidraw.com/#json=1ztbZ26T3ri14SiJBZlt4,Rqa2mjiaYJesnfPYEiBdPQ
        const hasScrolledToEnd =
          Math.floor(scrollEl[scrollDimension] - scrollEl[scrollPos]) <=
          scrollEl[clientDimension];
        if (hasScrolledToEnd) {
          // If scrolled to the end, set page to last as it may not end up with an
          // offset of 0 due to scroll capping.
          // (it's not quite aligned with how snapping works, but good enough for now)
          setCarouselState({
            pages: newPages,
            activePageIndex: newPages.length - 1,
          });
          return;
        }
      }

      const scrollPort = scrollEl.getBoundingClientRect();
      const offsets = newPages.map((page) => {
        const leadIndex = page[0];
        const leadEl = scrollEl.querySelector(`[data-index="${leadIndex}"]`);
        assert(leadEl instanceof HTMLElement, "Expected HTMLElement");
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          leadEl,
          nearSidePos,
        );
        const rect = leadEl.getBoundingClientRect();
        const offset =
          rect[nearSidePos] - scrollPort[nearSidePos] - scrollSpacing;
        return Math.abs(offset);
      });
      const minOffset = Math.min(...offsets);
      const nextActivePageIndex = offsets.indexOf(minOffset);
      setCarouselState({
        pages: newPages,
        activePageIndex: nextActivePageIndex,
      });

      // before we possibly disable a button
      // shift the focus to the other button
      const previousButton = scrollEl.querySelector("[data-prev-button]") as
        | HTMLButtonElement
        | undefined;
      if (
        !enableLoopPagination &&
        nextActivePageIndex === 0 &&
        document.activeElement === previousButton
      ) {
        previousButton.focus();
      }
      const nextButton = scrollEl.querySelector("[data-next-button]") as
        | HTMLButtonElement
        | undefined;
      if (
        !enableLoopPagination &&
        nextActivePageIndex === newPages.length - 1 &&
        document.activeElement === nextButton
      ) {
        nextButton.focus();
      }
    },
    [
      scrollEl,
      scrollBy,
      setCarouselState,
      enableLoopPagination,
      scrollDimension,
      scrollPos,
      clientDimension,
      nearSidePos,
    ],
  );

  const refresh = useCallback(() => {
    if (!scrollEl) return;

    const items = Array.from(scrollEl.querySelectorAll("[data-carousel-item]"));
    const scrollPort = scrollEl.getBoundingClientRect();
    let currPageStartPos: number;
    const pages = items.reduce<number[][]>((acc, node, i) => {
      const currPage = acc[acc.length - 1];
      const rect = getOffsetRect(node, node.parentElement);
      if (
        !currPage ||
        rect[farSidePos] - currPageStartPos > Math.ceil(scrollPort[dimension])
      ) {
        acc.push([i]);
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          node as HTMLElement,
          nearSidePos,
        );
        currPageStartPos = rect[nearSidePos] - scrollSpacing;
      } else {
        currPage.push(i);
      }
      return acc;
    }, []);
    refreshActivePage(pages);
  }, [scrollEl, refreshActivePage, farSidePos, dimension, nearSidePos]);

  useSafeLayoutEffect(refresh, [refresh]);

  useResizeObserver(scrollEl, refresh);

  useEffect(() => {
    if (!scrollEl) return;

    function handler(e: Event) {
      refreshActivePage(pages);

      if (!e.target) return;

      if (e.target[scrollPos] === 0) {
        setScrollPosition("start");
        onScrollPositionChange?.("start");
      } else if (
        e.target[scrollPos] + e.target[clientDimension] ===
        e.target[scrollDimension]
      ) {
        setScrollPosition("end");
        onScrollPositionChange?.("end");
      } else {
        setScrollPosition("middle");
        onScrollPositionChange?.("middle");
      }
    }
    scrollEl.addEventListener("scroll", handler, { passive: true });
    return () => {
      scrollEl.removeEventListener("scroll", handler);
    };
  }, [
    clientDimension,
    onScrollPositionChange,
    pages,
    refreshActivePage,
    scrollDimension,
    scrollEl,
    scrollPos,
  ]);

  const scroll = useCallback(
    (nearSideEdge: number, opts: ScrollOpts) => {
      if (!scrollEl) return;

      const { animate = true } = opts;
      if (!animate) {
        scrollEl[scrollPos] = nearSideEdge;
        return;
      }

      scrollEl.scrollTo({
        behavior: scrollBehavior,
        [nearSidePos]: nearSideEdge,
      });
    },
    [nearSidePos, scrollBehavior, scrollEl, scrollPos],
  );

  const scrollTo = useCallback(
    (index: number, opts: { animate?: boolean } = {}) => {
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const leadIndex: number | undefined = page[0];
      const leadEl = scrollEl.querySelector[leadIndex];
      if (!(leadEl instanceof HTMLElement)) return;

      const scrollSpacing = getEffectiveScrollSpacing(
        scrollEl,
        leadEl,
        nearSidePos,
      );

      const nearSideEdge =
        getOffsetRect(leadEl, leadEl.parentElement)[nearSidePos] -
        scrollSpacing;

      scroll(nearSideEdge, opts);
    },
    [nearSidePos, pages, scroll, scrollEl],
  );

  const scrollIntoView = useCallback(
    (index: number, opts: ScrollOpts = {}) => {
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const leadIndex: number | undefined = page[0];
      const leadEl = scrollEl.querySelector[leadIndex];
      if (!(leadEl instanceof HTMLElement)) return;

      const startScrollSpacing = getEffectiveScrollSpacing(
        scrollEl,
        leadEl,
        nearSidePos,
      );
      const rect = getOffsetRect(leadEl, leadEl.parentElement);
      const itemStartEdge = rect[nearSidePos] - startScrollSpacing;
      // TODO: not appropriately accounting for end scroll spacing here
      const itemEndEdge = rect[farSidePos];

      const currentScrollPosStart = scrollEl[scrollPos];
      const currentScrollPosEnd =
        currentScrollPosStart + scrollEl[clientDimension];

      if (
        // If item is in view, don't scroll
        itemStartEdge >= currentScrollPosStart &&
        itemEndEdge <= currentScrollPosEnd
      ) {
        return;
      }

      scroll(itemStartEdge, opts);
    },
    [
      clientDimension,
      farSidePos,
      nearSidePos,
      pages,
      scroll,
      scrollEl,
      scrollPos,
    ],
  );

  const scrollToPreviousPage: CarouselPaginate = (opts) => {
    const next = activePageIndex - 1;
    if ((opts?.loop ?? enableLoopPagination) && next < 0) {
      scrollTo(pages.length - 1);
      return pages.length - 1;
    }
    scrollTo(next, { animate: opts?.animate });
    return next;
  };

  const scrollToNextPage: CarouselPaginate = (opts) => {
    const next = activePageIndex + 1;
    if ((opts?.loop ?? enableLoopPagination) && next > pages.length - 1) {
      scrollTo(0);
      return 0;
    }
    scrollTo(next, { animate: opts?.animate });
    return next;
  };

  const snapPointIndexes = useMemo(() => {
    if (scrollBy === "item") {
      return new Set(flatten(pages));
    }
    return new Set(pages.map((page) => page[0]));
  }, [pages, scrollBy]);

  return {
    scrollIntoView,
    scrollToPreviousPage,
    scrollToNextPage,
    scrollTo,
    refresh,
    activePageIndex,
    snapPointIndexes,
    pages,
    assignScrollerEl: setScrollEl,
    scrollerEl: scrollEl,
    scrollPosition,
    orientation,
    collection,
    id: useId(),
  };
};
