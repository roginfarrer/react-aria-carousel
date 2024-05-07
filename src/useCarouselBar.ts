import {
  cloneElement,
  ComponentPropsWithoutRef,
  createElement,
  Dispatch,
  ElementType,
  KeyboardEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
} from "react";
import { useCollection } from "@react-stately/collections";
import { ListCollection } from "@react-stately/list";
import { Collection, CollectionStateBase, Node } from "@react-types/shared";

import {
  getNavItem,
  getNavList,
  getNextButton,
  getPrevButton,
} from "./utils.js";
import { useAriaBusyScroll } from "./utils/useAriaBusyScroll";

export interface CarouselStateProps<T extends object>
  extends CollectionStateBase<T> {
  itemsPerPage?: number;
  loop?: "infinite" | "native" | false;
  orientation?: "vertical" | "horizontal";
  scrollBy?: "page" | "item";
}

export interface CarouselState<T extends object> {
  itemsPerPage: number;
  collection: Collection<Node<T>>;
  activePageIndex: number;
  scrollBy: CarouselStateProps<T>["scrollBy"];
  // items: HTMLElement[];
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
    orientation = "horizontal",
    children,
    collection: propCollection,
    items: collectionItems,
  } = props;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages, setPages] = useState<number[][]>([]);
  const scroller = ref;

  let factory = useCallback(
    (nodes: Iterable<Node<T>>) => new ListCollection(nodes),
    [],
  );
  const collection = useCollection(
    { collection: propCollection, children, items: collectionItems },
    factory,
    { suppressTextValueWarning: true },
  );

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

  const syncClones = useCallback(() => {
    const newPages = pages;
    if (!scroller || newPages.length === 0) return;
    getSlides({ includeClones: true }).forEach((item) => {
      if (item.hasAttribute("data-clone")) {
        item.remove();
      }
    });

    if (loop === "infinite") {
      const items = getSlides();
      const firstPage = newPages[0];
      const lastPage = newPages[newPages.length - 1];

      if (firstPage === lastPage) {
        return;
      }

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

    // scrollToPage(activePageIndex, "instant");
  }, [
    // activePageIndex,
    getSlides,
    loop,
    pages,
    // scrollToPage,
    scroller,
    updateSnaps,
  ]);

  const calculatePages = useCallback(() => {
    const items = getSlides();
    // We want to calculate the sets of pages based on the number
    // only 100% in view on a given page. If a number like 1.1 is provided,
    // the 10% we're peeking shouldn't count as an item on the page.
    const actualItemsPerPage = Math.floor(itemsPerPage);
    let newPages = items.reduce<number[][]>((acc, _, i) => {
      const currPage = acc[acc.length - 1];
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

  useEffect(() => {
    // By running after pages updated, we avoid changing the scroll position
    syncClones();
    // scrollToPage(activePageIndex, "instant");
  }, [syncClones]);

  const foo = useCallback(
    (index: number) => {
      const items = getSlides();
      const itemsWithClones = getSlides({ includeClones: true });
      const pagesWithClones = [pages[pages.length - 1], ...pages, pages[0]];

      if (!items.length) return;

      if (loop === "infinite") {
        // The index allowing to be inclusive of cloned pages
        let nextIndex = clamp(-1, index, pagesWithClones.length);
        if (nextIndex < 0) {
          // First item in the prepended cloned page
          let item = itemsWithClones[0];
          scrollToItem(item);
          return;
        }

        if (nextIndex >= pages.length) {
          // First item in the appended cloned page
          let item = itemsWithClones.at(-1 * itemsPerPage) as HTMLElement;
          scrollToItem(item);
          return;
        }

        // Sorting because of some weird bug I can't figure out :(
        let item = items[pages[nextIndex].sort((a, b) => a - b)[0]];
        scrollToItem(item);
        return;
      }

      if (loop === "native") {
        let nextIndex =
          index > pages.length - 1 ? 0 : index < 0 ? pages.length - 1 : index;
        const page = pages[nextIndex];
        let itemIndex = page[0];
        let item = items[itemIndex];

        scrollToItem(item);
        return;
      }

      let nextIndex = clamp(0, index, pages.length - 1);
      const page = pages[nextIndex];
      let itemIndex = page[0];
      let item = items[itemIndex];

      scrollToItem(item);
    },
    [getSlides, itemsPerPage, loop, pages, scrollToItem],
  );

  const next = useCallback(() => {
    foo(activePageIndex + 1);
  }, [activePageIndex, foo]);

  const prev = useCallback(() => {
    foo(activePageIndex - 1);
  }, [activePageIndex, foo]);

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
    // items,
    pages,
    next,
    prev,
    scrollToPage,
  };
}

type Attributes<T extends ElementType> = ComponentPropsWithoutRef<T> &
  Partial<Record<`data-${string}`, string | number | boolean>> & {
    inert?: string;
  };

export interface CarouselProps<T extends object> extends CarouselStateProps<T> {
  spaceBetweenSlides?: string;
  id?: string;
  scrollPadding?: string;
}

export interface CarouselAria<T extends object> extends CarouselState<T> {
  navProps: Attributes<"div">;
  rootProps: Attributes<"div">;
  prevButtonProps: Attributes<"button">;
  nextButtonProps: Attributes<"button">;
  scrollerProps: Attributes<"div">;
}

export function useCarousel<T extends object>(
  props: CarouselProps<T>,
): [Dispatch<SetStateAction<HTMLElement | null>>, CarouselAria<T>] {
  const {
    itemsPerPage = 1,
    loop = false,
    orientation = "horizontal",
    spaceBetweenSlides = "0px",
    id,
    scrollPadding,
  } = props;
  const [host, setHost] = useState<HTMLElement | null>(null);
  const state = useCarouselState(props, host);
  const { pages, activePageIndex, next, prev } = state;
  const uniqueId = useId();
  let scrollerId = id ?? uniqueId;

  const handleRootKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      function forward() {
        if (!host) return;
        e.preventDefault();
        const nav = getNavList(host);
        const { pageIndex: nextIndex } = next();
        if (nav?.contains(e.target as never)) {
          const nextItem = getNavItem(host, nextIndex);
          nextItem?.focus();
        } else if (!loop && nextIndex >= pages.length - 1) {
          getNextButton(host)?.focus();
        } else {
          getPrevButton(host)?.focus();
        }
      }
      function backward() {
        if (!host) return;
        e.preventDefault();
        const nav = getNavList(host);
        const { pageIndex: nextIndex } = prev();
        if (nav?.contains(e.target as never)) {
          const nextItem = getNavItem(host, nextIndex);
          nextItem?.focus();
        } else if (!loop && nextIndex <= 0) {
          getPrevButton(host)?.focus();
        } else {
          getNextButton(host)?.focus();
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
    },
    [host, next, loop, pages.length, prev, orientation],
  );

  useAriaBusyScroll(host);

  return [
    setHost,
    {
      ...state,
      navProps: {
        role: "tablist",
        "aria-controls": scrollerId,
      },
      rootProps: {
        onKeyDown: handleRootKeyDown,
        "aria-roledescription": "carousel",
      },
      prevButtonProps: {
        "aria-label": "Previous page",
        "aria-controls": scrollerId,
        "data-prev-button": true,
        onClick: () => prev(),
        disabled: loop ? false : activePageIndex <= 0,
      },
      nextButtonProps: {
        "aria-label": "Next page",
        "aria-controls": scrollerId,
        "data-next-button": true,
        onClick: () => next(),
        disabled: loop ? false : activePageIndex >= pages.length - 1,
      },
      scrollerProps: {
        tabIndex: 0,
        "aria-atomic": true,
        "aria-busy": false,
        id: scrollerId,
        "data-orientation": orientation,
        style: {
          [orientation === "horizontal" ? "gridAutoColumns" : "gridAutoRows"]:
            `calc(100% / ${itemsPerPage} - ${spaceBetweenSlides} * ${itemsPerPage - 1} / ${itemsPerPage})`,
          gap: spaceBetweenSlides,
          scrollPaddingInline: scrollPadding,
          paddingInline: scrollPadding,
        },
      },
    },
  ];
}

export interface CarouselItemProps<T extends object> {
  item: Node<T>;
}

export interface CarouselItem {
  itemProps: Attributes<"div">;
}

export function useCarouselItem<T extends object>(
  props: CarouselItemProps<T>,
  state: CarouselAria<T>,
): CarouselItem {
  const { item } = props;
  const { pages, activePageIndex, scrollBy, itemsPerPage } = state;
  const actualItemsPerPage = Math.floor(itemsPerPage);

  const shouldSnap =
    scrollBy === "item" ||
    (item.index! + actualItemsPerPage) % actualItemsPerPage === 0;

  return {
    itemProps: {
      "data-carousel-item": item.index,
      inert: pages[activePageIndex]?.includes(item.index!) ? undefined : "true",
      "aria-hidden": pages[activePageIndex]?.includes(item.index!)
        ? undefined
        : true,
      role: "group",
      // @TODO: should be configurable
      "aria-label": `Item ${item.index! + 1} of ${state.collection.size}`,
      // style: {
      //   scrollSnapAlign: shouldSnap ? "start" : undefined,
      // },
    },
  };
}

export interface UseCarouselNavItemProps {
  index: number;
  isSelected?: boolean;
}

export interface CarouselNavItem {
  navItemProps: Attributes<"button">;
  isSelected: boolean;
}

export function useCarouselNavItem<T extends object>(
  props: UseCarouselNavItemProps,
  state: CarouselAria<T>,
): CarouselNavItem {
  // const itemId = genItemId(state.id, props.index);
  const isSelected = props.isSelected ?? state.activePageIndex === props.index;
  let current = props.index + 1,
    setSize = state.pages.length;
  return {
    navItemProps: {
      role: "tab",
      "aria-label": `Go to item ${current} of ${setSize}`,
      "aria-posinset": current,
      "aria-setsize": setSize,
      "aria-selected": isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => state.scrollToPage(props.index),
    },
    isSelected,
  };
}

function clamp(min: number, value: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
