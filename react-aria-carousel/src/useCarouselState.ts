import { useCallback, useEffect, useMemo, useState } from "react";

import { clamp, useCallbackRef, usePrefersReducedMotion } from "./utils";

/**
 * Options for useCarouselState
 */
export interface CarouselStateProps {
  /**
   * Number of items visible on a page. Can be an integer to
   * show each item with equal dimensions, or a floating point
   * number to "peek" subsequent items.
   * @default 1
   */
  itemsPerPage?: number;
  /**
   * Controls the pagination behavior at the beginning and end.
   * "infinite" - will seamlessly loop to the other end of the carousel.
   * "native" - will scroll to the other end of the carousel.
   * false - will not advance beyond the first and last items.
   * @default false
   */
  loop?: "infinite" | "native" | false;
  /**
   * The carousel scroll direction.
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Controls whether scrolling snaps and pagination progresses by item or page.
   * @default 'page'
   */
  scrollBy?: "page" | "item";
  /**
   * Define the organization of pages on first render.
   * Useful to render navigation during SSR.
   * @default []
   */
  initialPages?: number[][];
  /** Whether the carousel should scroll when the user drags with their mouse */
  mouseDragging?: boolean;
  /**
   * Ref object that reflects whether the user is actively dragging
   * the carousel with their mouse
   */
  isDraggingRef?: { current: boolean };
  /**
   * Handler called when the activePageIndex changes
   */
  onActivePageIndexChange?: ({ index }: { index: number }) => void;
}

/**
 * API returned by useCarouselState
 */
export interface CarouselState
  extends Required<Pick<CarouselStateProps, "itemsPerPage" | "scrollBy">> {
  /** The index of the page in view. */
  readonly activePageIndex: number;
  /** The indexes of all items organized into arrays. */
  readonly pages: number[][];
  /** Scrolls the carousel to the next page. */
  next: () => number;
  /** Scrolls the carousel to the previous page. */
  prev: () => number;
  /** Scrolls the carousel to the provided page index. */
  scrollToPage: (index: number) => void;
}

export function useCarouselState(
  {
    itemsPerPage = 1,
    scrollBy = "page",
    loop = false,
    initialPages = [],
    isDraggingRef,
    mouseDragging,
    onActivePageIndexChange: propChangeHandler,
  }: CarouselStateProps,
  host: HTMLElement | null,
): CarouselState {
  const onActivePageIndexChange = useCallbackRef(propChangeHandler);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages, setPages] = useState<number[][]>(initialPages);
  const prefersReducedMotion = usePrefersReducedMotion();

  const getItems = useCallback(
    (
      { includeClones }: { includeClones?: boolean } = { includeClones: false },
    ): HTMLElement[] => {
      if (!host) return [];
      let allChildren = Array.from(host.children) as HTMLElement[];
      if (includeClones) return allChildren;
      return allChildren.filter((child) => !child.hasAttribute("data-clone"));
    },
    [host],
  );

  const scrollToItem = useCallback(
    (slide: HTMLElement, behavior: ScrollBehavior = "smooth"): void => {
      if (!host) return;
      const scrollContainerRect = host.getBoundingClientRect();
      const nextSlideRect = slide.getBoundingClientRect();

      const nextLeft = nextSlideRect.left - scrollContainerRect.left;
      const nextTop = nextSlideRect.top - scrollContainerRect.top;

      host.scrollTo({
        left: nextLeft + host.scrollLeft,
        top: nextTop + host.scrollTop,
        behavior: prefersReducedMotion ? "instant" : behavior,
      });
    },
    [prefersReducedMotion, host],
  );

  const scrollToPage = useCallback(
    (index: number, behavior?: ScrollBehavior): void => {
      const items = getItems();
      const page = pages[index];
      const itemIndex = page?.[0];
      if (items[itemIndex]) {
        scrollToItem(items[itemIndex], behavior);
      }
    },
    [getItems, pages, scrollToItem],
  );

  const updateSnaps = useCallback((): void => {
    const actualItemsPerPage = Math.floor(itemsPerPage);
    getItems({ includeClones: true }).forEach((item, index) => {
      const shouldSnap =
        scrollBy === "item" ||
        (index! + actualItemsPerPage) % actualItemsPerPage === 0;
      if (shouldSnap) {
        item.style.setProperty("scroll-snap-align", "start");
      } else {
        item.style.removeProperty("scroll-snap-align");
      }
    });
  }, [getItems, itemsPerPage, scrollBy]);

  const calculatePages = useCallback((): void => {
    const items = getItems();
    // We want to calculate the sets of pages based on the number
    // only 100% in view on a given page. If a number like 1.1 is provided,
    // the 10% we're peeking shouldn't count as an item on the page.
    const actualItemsPerPage = Math.floor(itemsPerPage);
    let newPages = items.reduce<number[][]>((acc, _, i) => {
      const currPage = acc.at(-1);
      if (currPage && currPage.length < actualItemsPerPage) {
        currPage.push(i);
      } else {
        acc.push([i]);
      }
      return acc;
    }, []);

    if (newPages.length >= 2) {
      let deficit = actualItemsPerPage - newPages.at(-1)!.length;
      if (deficit > 0) {
        const fill = [...newPages.at(-2)!].splice(actualItemsPerPage - deficit);
        newPages.at(-1)!.unshift(...fill);
      }
    }
    setPages(newPages);
    setActivePageIndex((prev) => {
      const index = clamp(0, prev, newPages.length - 1);
      if (index !== prev) {
        onActivePageIndexChange?.({ index });
      }
      return index;
    });
  }, [getItems, itemsPerPage, onActivePageIndexChange]);

  const scrollToPageIndex = useCallback(
    (index: number): number => {
      const items = getItems();
      const itemsWithClones = getItems({ includeClones: true });
      const pagesWithClones = [pages.at(-1), ...pages, pages[0]];

      if (!items.length) return -1;

      let nextItem: HTMLElement, nextPageIndex: number, nextPage: number[];

      // @TODO: This should be rewritten for clarity and brevity
      if (loop === "infinite") {
        // The index allowing to be inclusive of cloned pages
        let nextIndex = clamp(-1, index, pagesWithClones.length);

        if (nextIndex < 0) {
          // First item in the prepended cloned page
          nextItem = itemsWithClones[0];
          nextPageIndex = pages.length - 1;
          nextPage = pages[nextPageIndex];
        } else if (nextIndex >= pages.length) {
          // First item in the appended cloned page
          nextItem = itemsWithClones.at(-1 * itemsPerPage) as HTMLElement;
          nextPageIndex = 0;
          nextPage = pages[0];
        } else {
          nextPageIndex = nextIndex;
          nextPage = pages[nextIndex];
          nextItem = items[nextPage[0]];
        }
      } else if (loop === "native") {
        nextPageIndex =
          index > pages.length - 1 ? 0 : index < 0 ? pages.length - 1 : index;
        nextPage = pages[nextPageIndex];
        let itemIndex = nextPage[0];
        nextItem = items[itemIndex];
      } else {
        nextPageIndex = clamp(0, index, pages.length - 1);
        nextPage = pages[nextPageIndex];
        let itemIndex = nextPage[0];
        nextItem = items[itemIndex];
      }

      scrollToItem(nextItem);
      return nextPageIndex;
    },
    [getItems, itemsPerPage, loop, pages, scrollToItem],
  );

  const next = useCallback((): number => {
    return scrollToPageIndex(activePageIndex + 1);
  }, [activePageIndex, scrollToPageIndex]);

  const prev = useCallback((): number => {
    return scrollToPageIndex(activePageIndex - 1);
  }, [activePageIndex, scrollToPageIndex]);

  useEffect(() => {
    if (!host || pages.length === 0) return;

    getItems({ includeClones: true }).forEach((item) => {
      if (item.hasAttribute("data-clone")) {
        item.remove();
      }
    });

    if (loop === "infinite") {
      const items = getItems();
      const firstPage = pages[0];
      // We're gonna modify this in a second with .reverse, so make sure not to mutate state
      const lastPage = [...pages.at(-1)!];

      if (firstPage === lastPage) return;

      lastPage.reverse().forEach((slide) => {
        const clone = items[slide].cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        host.prepend(clone);
      });

      firstPage.forEach((slide) => {
        const clone = items[slide].cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        host.append(clone);
      });
    }

    updateSnaps();
    scrollToPage(activePageIndex, "instant");
    // Purposefully avoiding running this effect if the page index changes
    // Otherwise we're just running this all the time.
    // We just want to grab the latest activePageIndex when this runs otherwise
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // activePageIndex,
    getItems,
    loop,
    pages,
    scrollToPage,
    host,
    updateSnaps,
  ]);

  useEffect(() => {
    if (!host) return;

    calculatePages();
    updateSnaps();

    const mutationObserver = new MutationObserver((mutations) => {
      const childrenChanged = mutations.some((mutation) =>
        // @ts-expect-error This is fine
        [...mutation.addedNodes, ...mutation.removedNodes].some(
          (el: HTMLElement) =>
            el.hasAttribute("data-carousel-item") &&
            !el.hasAttribute("data-clone"),
        ),
      );
      if (childrenChanged) {
        calculatePages();
        updateSnaps();
      }
    });

    mutationObserver.observe(host, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, [getItems, host, calculatePages, updateSnaps]);

  useEffect(() => {
    if (!host) return;

    const hasIntersected = new Set<Element>();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasIntersected.has(entry.target)) {
            hasIntersected.add(entry.target);
          }
          if (!entry.isIntersecting) {
            hasIntersected.delete(entry.target);
          }
        }
      },
      {
        root: host,
        threshold: 0.6,
      },
    );
    for (let child of getItems({ includeClones: true })) {
      intersectionObserver.observe(child);
    }

    function handleScrollEnd() {
      if (hasIntersected.size === 0) return;
      const sorted = [...hasIntersected].sort((a, b) => {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1;
      });
      const firstIntersecting = sorted[0];

      if (
        loop === "infinite" &&
        firstIntersecting.hasAttribute("data-clone") &&
        !(mouseDragging && isDraggingRef?.current)
      ) {
        const cloneIndex = firstIntersecting.getAttribute("data-carousel-item");
        const actualItem = getItems().find(
          (el) => el.getAttribute("data-carousel-item") === cloneIndex,
        );
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToItem(actualItem!, "instant");
          });
        });
      } else {
        const indexString = (firstIntersecting as HTMLElement).dataset
          .carouselItem;

        if (process.env.NODE_ENV !== "production") {
          if (!indexString) {
            throw new Error(
              "Failed to find data-carousel-item HTML attribute on an item.",
            );
          }
        }

        setActivePageIndex((prev) => {
          const slideIndex = parseInt(indexString!, 10);
          const activePage = pages.findIndex((page) => page[0] === slideIndex);
          const newIndex = clamp(0, activePage, getItems().length);
          if (prev !== newIndex) {
            onActivePageIndexChange?.({ index: newIndex });
          }
          return newIndex;
        });
      }
    }

    // Ideally we'd use the 'scrollend' event here.
    // However, some browsers will call the 'scrollend' handler *before*
    // snapping has settled. So in effect, the user will release the scroll,
    // then 'scrollend' event is called, and the element continues to scroll
    // to the closest snap position
    //
    // This will let us check whether scrolling has actually stopped and
    // whether the user is still dragging
    let timeout: any;
    function handleScroll() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (mouseDragging && isDraggingRef?.current) return;
        handleScrollEnd();
      }, 150);
    }

    host.addEventListener("scroll", handleScroll);
    return () => {
      intersectionObserver.disconnect();
      host.removeEventListener("scroll", handleScroll);
    };
  }, [
    getItems,
    isDraggingRef,
    loop,
    mouseDragging,
    onActivePageIndexChange,
    pages,
    scrollToItem,
    host,
  ]);

  return useMemo(
    () => ({
      itemsPerPage,
      activePageIndex,
      scrollBy,
      pages,
      next,
      prev,
      scrollToPage,
    }),
    [activePageIndex, itemsPerPage, next, pages, prev, scrollBy, scrollToPage],
  );
}
