import { useCallback, useEffect, useState } from "react";
import { Collection, CollectionStateBase, Node } from "@react-types/shared";

import { clamp, usePrefersReducedMotion } from "./utils";
import { useCollection } from "./utils/useCollection";

export interface CarouselStateProps<T extends object>
  extends CollectionStateBase<T> {
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
}

export interface CarouselState<T extends object>
  extends Required<Pick<CarouselStateProps<T>, "itemsPerPage" | "scrollBy">> {
  /** The collection of items in the carousel. */
  readonly collection: Collection<Node<T>>;
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

export function useCarouselState<T extends object>(
  props: CarouselStateProps<T>,
  ref: HTMLElement | null,
): CarouselState<T> {
  const {
    itemsPerPage = 1,
    scrollBy = "page",
    loop = false,
    children,
    collection: propCollection,
    items: collectionItems,
    initialPages = [],
  } = props;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages, setPages] = useState<number[][]>(initialPages);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scroller = ref;

  const collection = useCollection({
    collection: propCollection,
    children,
    items: collectionItems,
  });

  const getItems = useCallback(
    (
      { includeClones }: { includeClones?: boolean } = { includeClones: false },
    ): HTMLElement[] => {
      if (!scroller) return [];
      let allChildren = Array.from(scroller.children) as HTMLElement[];
      if (includeClones) return allChildren;
      return allChildren.filter((child) => !child.hasAttribute("data-clone"));
    },
    [scroller],
  );

  const scrollToItem = useCallback(
    (slide: HTMLElement, behavior: ScrollBehavior = "smooth"): void => {
      if (!scroller) return;
      const scrollContainerRect = scroller.getBoundingClientRect();
      const nextSlideRect = slide.getBoundingClientRect();

      const nextLeft = nextSlideRect.left - scrollContainerRect.left;
      const nextTop = nextSlideRect.top - scrollContainerRect.top;

      scroller.scrollTo({
        left: nextLeft + scroller.scrollLeft,
        top: nextTop + scroller.scrollTop,
        behavior: prefersReducedMotion ? "instant" : behavior,
      });
    },
    [prefersReducedMotion, scroller],
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
      return clamp(0, prev, newPages.length - 1);
    });
  }, [getItems, itemsPerPage]);

  // @TODO: Rewrite this better
  const scrollToPageIndex = useCallback(
    (index: number): number => {
      const items = getItems();
      const itemsWithClones = getItems({ includeClones: true });
      const pagesWithClones = [pages.at(-1), ...pages, pages[0]];

      if (!items.length) return -1;

      let nextItem: HTMLElement, nextPageIndex: number, nextPage: number[];

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
    if (!scroller || pages.length === 0) return;

    getItems({ includeClones: true }).forEach((item) => {
      if (item.hasAttribute("data-clone")) {
        item.remove();
      }
    });

    if (loop === "infinite") {
      const items = getItems();
      const firstPage = pages[0];
      // We're gonna modify this in a second, so make sure not to mutate state
      const lastPage = [...pages.at(-1)!];

      if (firstPage === lastPage) return;

      lastPage.reverse().forEach((slide) => {
        const clone = items[slide].cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        scroller.prepend(clone);
      });

      firstPage.forEach((slide) => {
        const clone = items[slide].cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        scroller.append(clone);
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
    scroller,
    updateSnaps,
  ]);

  useEffect(() => {
    if (!scroller) return;

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

    mutationObserver.observe(scroller, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, [getItems, scroller, calculatePages, updateSnaps]);

  useEffect(() => {
    if (!scroller) return;
    function handle() {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          intersectionObserver.disconnect();
          const firstIntersecting = entries.find(
            (entry) => entry.isIntersecting,
          );

          if (firstIntersecting) {
            if (
              loop === "infinite" &&
              firstIntersecting.target.hasAttribute("data-clone")
            ) {
              const cloneIndex =
                firstIntersecting.target.getAttribute("data-carousel-item");
              const actualItem = getItems().find(
                (el) => el.getAttribute("data-carousel-item") === cloneIndex,
              );
              scrollToItem(actualItem!, "instant");
            } else {
              const indexString = (firstIntersecting.target as HTMLElement)
                .dataset.carouselItem;

              if (process.env.NODE_ENV !== "production") {
                if (!indexString) {
                  throw new Error(
                    "Failed to find data-carousel-item HTML attribute on an item.",
                  );
                }
              }

              const slideIndex = parseInt(indexString!, 10);
              const activePage = pages.findIndex((page) =>
                page.includes(slideIndex),
              );
              setActivePageIndex(clamp(0, activePage, getItems().length));
            }
          }
        },
        {
          root: scroller,
          threshold: 0.6,
        },
      );
      for (let child of getItems({ includeClones: true })) {
        intersectionObserver.observe(child);
      }
    }
    scroller.addEventListener("scrollend", handle);
    return () => {
      scroller.removeEventListener("scrollend", handle);
    };
  }, [getItems, loop, pages, scrollToItem, scroller]);

  return {
    itemsPerPage,
    collection,
    activePageIndex,
    scrollBy,
    pages,
    next,
    prev,
    scrollToPage,
  };
}
