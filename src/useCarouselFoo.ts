import {
  useEffect,
  useState,
  useCallback,
  KeyboardEventHandler,
  useRef,
  useId,
  useMemo,
  RefObject,
} from "react";
import { ListCollection } from "@react-stately/list";

import { announce } from "@react-aria/live-announcer";
import { useReducedMotion } from "@mantine/hooks";

// import { createScrollStopListener } from "./utils/createScrollEndListener.js";
import { useSafeLayoutEffect } from "./utils/useSafeLayoutEffect.js";
import { useResizeObserver } from "./utils/useResizeObserver.js";
import { useCallbackRef } from "./utils/useCallbackRef.js";

import {
  assert,
  getEffectiveScrollSpacing,
  getOffsetRect,
} from "./internal/dimensions.js";
import { flatten } from "./internal/utils.js";
import { useCarouselElementRefs } from "./internal/utils.js";
import { Node, CollectionStateBase } from "@react-types/shared";
import { useCollection } from "@react-stately/collections";

interface ScrollOpts {
  /**
   * If false, will jump to the provided page without scrolling animation
   * @default true
   */
  animate?: boolean;
}

type CarouselPaginate = (opts?: ScrollOpts & { loop?: boolean }) => number;

export interface CarouselProps<T extends object>
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
  text?: {
    singleItemAnnouncement?: (opts: {
      currentItem: number;
      itemCount: number;
    }) => string;
    multiItemAnnouncement?: (opts: {
      currentItem: number;
      itemCount: number;
      itemsPerPage: number;
    }) => string;
    itemAriaLabel?: (opts: {
      currentItem: number;
      itemCount: number;
    }) => string;
    itemAriaRoleDescription?: string;
  };
  visibleItems?: number;
  spaceBetweenItems?: string;
}

/**
 * @public
 * @name useCarousel
 */
export interface CarouselResult {
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
  /** Function that returns props for a Carousel's navigation item */
  readonly getNavItemProps: (props: { index: number }) => {
    type: "button";
    role: "tab";
    "aria-controls": string;
    "aria-labelledby": string;
    "aria-posinset": number;
    "aria-setsize": number;
    "aria-selected": boolean;
    tabIndex: 0 | -1;
    onClick: () => void;
  };
  /** Function that returns props for a Carousel's navigation */
  readonly getNavProps: () => {
    role: "tablist";
  };
  /** Function that returns props for a Carousel Item */
  readonly getItemProps: (props: { index: number }) => {
    id: string;
    role: "group";
    "aria-label": string;
    "aria-roledescription": string;
  };
  /** Ref assignment handlers */
  readonly refs: ReturnType<typeof useCarouselElementRefs>[1];
  /** Function to be called on the onKeyDown event on the root carousel element */
  readonly handleRootElKeydown: KeyboardEventHandler<HTMLElement>;
}

const defaultProps: Partial<CarouselProps<object>> = {
  text: {
    singleItemAnnouncement({ currentItem, itemCount }) {
      return `Item ${currentItem} of ${itemCount}`;
    },
    multiItemAnnouncement({ currentItem, itemCount, itemsPerPage }) {
      return `Items ${currentItem} through ${currentItem + itemsPerPage} of ${itemCount}`;
    },
    itemAriaLabel({ itemCount, currentItem }) {
      return `${currentItem} of ${itemCount}`;
    },
    itemAriaRoleDescription: "item",
  },
  visibleItems: 1,
  spaceBetweenItems: "0px",
  orientation: "horizontal",
  initialPages: [],
};

export const useCarousel = <T extends object>(
  props: CarouselProps<T> = {},
  ref: RefObject<HTMLElement>,
) => {
  const {
    text: { multiItemAnnouncement, singleItemAnnouncement },
    visibleItems,
    spaceBetweenItems,
    orientation,
    scrollBy,
    onScrollPositionChange,
    onActivePageIndexChange,
    enableLoopPagination,
    children,
    items,
    collection: propCollection,
    initialPages,
  } = {
    ...defaultProps,
    ...props,
    text: {
      ...defaultProps.text,
      ...props.text,
    },
  };

  const uniqueId = useId();
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
    { collection: propCollection, children, items },
    factory,
  );

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

  const [scrollPosition, setScrollPosition] = useState<
    "start" | "middle" | "end"
  >("start");

  // const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  const { pages, activePageIndex } = state;

  // Because we're announcing the change on scroll, we need to dedupe the message
  // so we're not blasting the queue of announcements on every pixel shift
  const lastAnnounced = useRef<{ index: number; length: number }>({
    index: activePageIndex,
    length: pages.length,
  });

  const onPageChange = useCallbackRef(onActivePageIndexChange);

  const setCarouselState = useCallback(
    (args: { pages: number[][]; activePageIndex: number }) => {
      if (
        lastAnnounced.current.index !== args.activePageIndex ||
        lastAnnounced.current.length !== args.pages.length
      ) {
        const inView = args.pages[args.activePageIndex];
        if (!inView) return;
        const firstItem = inView[0];
        const lastItem = inView[inView.length - 1];
        if (firstItem === lastItem) {
          announce(
            singleItemAnnouncement({
              currentItem: args.activePageIndex + 1,
              itemCount: args.pages.length,
            }),
            "polite",
          );
        } else {
          announce(
            multiItemAnnouncement({
              currentItem: firstItem + 1,
              itemsPerPage: lastItem + 1,
              itemCount: flatten(args.pages).length,
            }),
            "polite",
          );
        }
        lastAnnounced.current = {
          index: args.activePageIndex,
          length: args.pages.length,
        };
      }
      bareSetCarouselState(args);
      onPageChange?.(args.activePageIndex);
    },
    [multiItemAnnouncement, onPageChange, singleItemAnnouncement],
  );

  const refreshActivePage = useCallback(
    (newPages: number[][]) => {
      const scrollEl = ref.current;
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

      const items = Array.from(scrollEl.children);
      const scrollPort = scrollEl.getBoundingClientRect();
      const offsets = newPages.map((page) => {
        const leadIndex = page[0];
        const leadEl = items[leadIndex];
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
      let prevBtn = scrollEl.querySelector("[data-prev-button]") as
        | HTMLButtonElement
        | undefined;
      let nextBtn = scrollEl.querySelector("[data-next-button]") as
        | HTMLButtonElement
        | undefined;
      if (
        !enableLoopPagination &&
        nextActivePageIndex === 0 &&
        document.activeElement === prevBtn
      ) {
        prevBtn.focus();
      }
      if (
        !enableLoopPagination &&
        nextActivePageIndex === newPages.length - 1 &&
        document.activeElement === nextBtn
      ) {
        nextBtn.focus();
      }
    },
    [
      ref,
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
    const scrollEl = ref.current;
    if (!scrollEl) return;

    const items = Array.from(scrollEl.children);
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
  }, [ref, refreshActivePage, farSidePos, dimension, nearSidePos]);

  useSafeLayoutEffect(refresh, [refresh]);

  useResizeObserver(ref.current, refresh);

  useEffect(() => {
    const scrollEl = ref.current;
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
    ref,
    refreshActivePage,
    scrollDimension,
    scrollPos,
  ]);

  /**
   * Wrapper around the Element.scrollTo method to fallback to a
   * polyfilled smooth-scroll if the browser doesn't support smooth scrollTo
   * ಠ_ಠ Safari
   */
  const scroll = useCallback(
    (nearSideEdge: number, opts: ScrollOpts) => {
      const scrollEl = ref.current;
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
    [nearSidePos, ref, scrollBehavior, scrollPos],
  );

  const scrollTo = useCallback(
    (index: number, opts: { animate?: boolean } = {}) => {
      const scrollEl = ref.current;
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const items = Array.from(scrollEl.children);
      const leadIndex: number | undefined = page[0];
      const leadEl = items[leadIndex];
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
    [nearSidePos, pages, ref, scroll],
  );

  const scrollIntoView = useCallback(
    (index: number, opts: ScrollOpts = {}) => {
      const scrollEl = ref.current;
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const items = Array.from(scrollEl.children);
      const leadIndex: number | undefined = page[0];
      const leadEl = items[leadIndex];
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
    [clientDimension, farSidePos, nearSidePos, pages, ref, scroll, scrollPos],
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

  const handleRootKeyDown: KeyboardEventHandler = (e) => {
    function forward() {
      e.preventDefault();
      const scrollEl = ref.current;
      const nav = scrollEl.querySelector('[role="tablist"]');
      const nextIndex = scrollToNextPage();
      if (nav?.contains(e.target as never)) {
        const items = Array.from(
          scrollEl.querySelectorAll("[data-carousel-item]"),
        );
        const nextItem = items[nextIndex] as HTMLElement | undefined;
        nextItem?.focus();
      } else if (!props.enableLoopPagination && nextIndex >= pages.length - 1) {
        let btn = scrollEl.querySelector("[data-prev-button]") as
          | HTMLButtonElement
          | undefined;
        btn?.focus();
      } else {
        let btn = scrollEl.querySelector("[data-next-button]") as
          | HTMLButtonElement
          | undefined;
        btn?.focus();
      }
    }
    function backward() {
      e.preventDefault();
      const scrollEl = ref.current;
      const nav = scrollEl.querySelector('[role="tablist"]');
      const nextIndex = scrollToPreviousPage();
      if (nav?.contains(e.target as never)) {
        const items = Array.from(
          scrollEl.querySelectorAll("[data-carousel-item]"),
        );
        const nextItem = items[nextIndex] as HTMLElement | undefined;
        nextItem?.focus();
      } else if (!enableLoopPagination && nextIndex <= 0) {
        let btn = scrollEl.querySelector("[data-prev-button]") as
          | HTMLButtonElement
          | undefined;
        btn?.focus();
      } else {
        let btn = scrollEl.querySelector("[data-next-button]") as
          | HTMLButtonElement
          | undefined;
        btn?.focus();
      }
    }

    switch (e.key) {
      case "ArrowUp": {
        if (orientation === "vertical") {
          backward();
        }
        break;
      }
      case "ArrowRight": {
        if (orientation === "horizontal") {
          forward();
        }
        break;
      }
      case "ArrowDown": {
        if (orientation === "vertical") {
          forward();
        }
        break;
      }
      case "ArrowLeft": {
        if (orientation === "horizontal") {
          backward();
        }
        break;
      }
    }
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
    pages,
    scrollPosition,
    id: uniqueId,
    carouselProps: {
      onKeyDown: handleRootKeyDown,
    },
    navProps: {
      role: "tablist",
    },
    carouselScrollerProps: {
      "data-orientation": orientation,
      style: {
        [orientation === "horizontal" ? "gridAutoColumns" : "gridAutoRows"]:
          `calc(100% / ${visibleItems} - ${spaceBetweenItems} * ${visibleItems - 1} / ${visibleItems})`,
      },
    },
    prevButtonProps: {
      "data-prev-button": true,
      onClick: () => scrollToPreviousPage(),
      disabled: enableLoopPagination ? false : activePageIndex <= 0,
    },
    nextButtonProps: {
      "data-next-button": true,
      onClick: () => scrollToNextPage(),
      disabled: enableLoopPagination
        ? false
        : activePageIndex >= pages.length - 1,
    },
    snapPointIndexes,
    collection,
  };
};
