import { useCallback, useEffect, useState } from "react";
import { Collection, CollectionStateBase, Node } from "@react-types/shared";

import { clamp } from "./utils";
import { useCollection } from "./utils/useCollection";

export interface CarouselStateProps<T extends object>
  extends CollectionStateBase<T> {
  itemsPerPage?: number;
  loop?: "infinite" | "native" | false;
  orientation?: "vertical" | "horizontal";
  scrollBy?: "page" | "item";
  initialPages?: number[][];
}

export interface CarouselState<T extends object> {
  itemsPerPage: number;
  collection: Collection<Node<T>>;
  activePageIndex: number;
  scrollBy: CarouselStateProps<T>["scrollBy"];
  pages: number[][];
  next: () => { page: number[]; pageIndex: number };
  prev: () => { page: number[]; pageIndex: number };
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
  const scroller = ref;

  const collection = useCollection({
    collection: propCollection,
    children,
    items: collectionItems,
  });

  const getSlides = useCallback(
    (
      { includeClones }: { includeClones?: boolean } = { includeClones: false },
    ) => {
      if (!scroller) return [];
      let allChildren = Array.from(scroller.children) as HTMLElement[];
      if (includeClones) return allChildren;
      return allChildren.filter((child) => !child.hasAttribute("data-clone"));
    },
    [scroller],
  );

  const scrollToItem = useCallback(
    (slide: HTMLElement, behavior: ScrollBehavior = "smooth") => {
      if (!scroller) return;
      const scrollContainerRect = scroller.getBoundingClientRect();
      const nextSlideRect = slide.getBoundingClientRect();

      const nextLeft = nextSlideRect.left - scrollContainerRect.left;
      const nextTop = nextSlideRect.top - scrollContainerRect.top;

      scroller.scrollTo({
        left: nextLeft + scroller.scrollLeft,
        top: nextTop + scroller.scrollTop,
        behavior,
      });
    },
    [scroller],
  );

  const scrollToPage = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const items = getSlides();
      const page = pages[index];
      const itemIndex = page?.[0];
      if (items[itemIndex]) {
        scrollToItem(items[itemIndex], behavior);
      }
    },
    [getSlides, pages, scrollToItem],
  );

  const updateSnaps = useCallback(() => {
    const actualItemsPerPage = Math.floor(itemsPerPage);
    getSlides({ includeClones: true }).forEach((item, index) => {
      const shouldSnap =
        scrollBy === "item" ||
        (index! + actualItemsPerPage) % actualItemsPerPage === 0;
      if (shouldSnap) {
        item.style.setProperty("scroll-snap-align", "start");
      } else {
        item.style.removeProperty("scroll-snap-align");
      }
    });
  }, [getSlides, itemsPerPage, scrollBy]);

  const calculatePages = useCallback(() => {
    const items = getSlides();
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
  }, [getSlides, itemsPerPage]);

  // @TODO: Rewrite this better
  const scrollToPageIndex = useCallback(
    (index: number) => {
      const items = getSlides();
      const itemsWithClones = getSlides({ includeClones: true });
      const pagesWithClones = [pages.at(-1), ...pages, pages[0]];

      if (!items.length) return;

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
      return { page: nextPage, pageIndex: nextPageIndex };
    },
    [getSlides, itemsPerPage, loop, pages, scrollToItem],
  );

  const next = useCallback(() => {
    return scrollToPageIndex(activePageIndex + 1);
  }, [activePageIndex, scrollToPageIndex]);

  const prev = useCallback(() => {
    return scrollToPageIndex(activePageIndex - 1);
  }, [activePageIndex, scrollToPageIndex]);

  useEffect(() => {
    if (!scroller || pages.length === 0) return;

    getSlides({ includeClones: true }).forEach((item) => {
      if (item.hasAttribute("data-clone")) {
        item.remove();
      }
    });

    if (loop === "infinite") {
      const items = getSlides();
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
    getSlides,
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
  }, [getSlides, scroller, calculatePages, updateSnaps]);

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
              const actualItem = getSlides().find(
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
              setActivePageIndex(clamp(0, activePage, getSlides().length));
            }
          }
        },
        {
          root: scroller,
          threshold: 0.6,
        },
      );
      for (let child of getSlides({ includeClones: true })) {
        intersectionObserver.observe(child);
      }
    }
    scroller.addEventListener("scrollend", handle);
    return () => {
      scroller.removeEventListener("scrollend", handle);
    };
  }, [getSlides, loop, pages, scrollToItem, scroller]);

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
