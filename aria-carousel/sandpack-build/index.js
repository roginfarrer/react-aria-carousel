import { createContext, useState, useId, useCallback, Fragment, useEffect, useRef, useContext, useLayoutEffect } from 'react';
import { Item, useCollection } from '@react-stately/collections';
import { ListCollection } from '@react-stately/list';
import { mergeProps as mergeProps$1, chain } from '@react-aria/utils';
import { jsx } from 'react/jsx-runtime';

// src/useCarousel.ts
function useAriaBusyScroll(host) {
  useEffect(() => {
    if (!host)
      return;
    function onscroll() {
      if (!host)
        return;
      host.setAttribute("aria-busy", "true");
      host.addEventListener("scrollend", onscrollend, { once: true });
    }
    function onscrollend() {
      if (!host)
        return;
      host.setAttribute("aria-busy", "false");
      host.addEventListener("scroll", onscroll, { once: true });
    }
    host.addEventListener("scroll", onscroll, { once: true });
    host.addEventListener("scrollend", onscrollend);
    return () => {
      host.removeEventListener("scroll", onscroll);
      host.removeEventListener("scrollend", onscrollend);
    };
  }, [host]);
}
function useCarouselCollection(props) {
  let factory = useCallback(
    (nodes) => new ListCollection(nodes),
    []
  );
  const collection = useCollection(props, factory, {
    suppressTextValueWarning: true
  });
  return collection;
}
function useMouseDrag(host) {
  const dragging = useRef(false);
  const handleDragging = useCallback(
    (event) => {
      if (!host)
        return;
      if (!dragging.current) {
        host.style.setProperty("scroll-snap-type", "none");
        dragging.current = true;
      }
      host.scrollBy({
        left: -event.movementX,
        top: -event.movementY,
        behavior: "instant"
      });
    },
    [host]
  );
  const handleDragEnd = useCallback(() => {
    if (!host)
      return;
    document.removeEventListener("pointermove", handleDragging, {
      capture: true
    });
    const startLeft = host.scrollLeft;
    const startTop = host.scrollTop;
    host.style.removeProperty("scroll-snap-type");
    host.style.setProperty("overflow", "hidden");
    const finalLeft = host.scrollLeft;
    const finalTop = host.scrollTop;
    host.style.removeProperty("overflow");
    host.style.setProperty("scroll-snap-type", "none");
    host.scrollTo({ left: startLeft, top: startTop, behavior: "instant" });
    requestAnimationFrame(async () => {
      if (startLeft !== finalLeft || startTop !== finalTop) {
        host.scrollTo({
          left: finalLeft,
          top: finalTop,
          behavior: "smooth"
        });
        await waitForEvent(host, "scrollend");
      }
      host.style.removeProperty("scroll-snap-type");
    });
    dragging.current = false;
  }, [handleDragging, host]);
  const handleDragStart = useCallback(
    (event) => {
      if (!host)
        return;
      let canDrag = event.button === 0;
      if (canDrag) {
        event.preventDefault();
        document.addEventListener("pointermove", handleDragging, {
          capture: true,
          passive: true
        });
        document.addEventListener("pointerup", handleDragEnd, {
          capture: true,
          once: true
        });
      }
    },
    [handleDragEnd, handleDragging, host]
  );
  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", handleDragging, {
        capture: true
      });
      document.removeEventListener("pointerup", handleDragEnd, {
        capture: true
      });
    };
  }, [handleDragEnd, handleDragging]);
  return {
    scrollerProps: {
      onMouseDown: handleDragStart
    }
  };
}
function waitForEvent(el, eventName) {
  return new Promise((resolve) => {
    function done(event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }
    el.addEventListener(eventName, done);
  });
}
var QUERY = "(prefers-reduced-motion: no-preference)";
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(!window.matchMedia(QUERY).matches);
    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };
    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);
  return prefersReducedMotion;
}
function mergeProps(...args) {
  let result = { ...args[0] };
  for (let i = 1; i < args.length; i++) {
    let props = args[i];
    for (let key in props) {
      let a = result[key];
      let b = props[key];
      if (typeof a === "function" && typeof b === "function" && // This is a lot faster than a regex.
      key[0] === "o" && key[1] === "n" && key.charCodeAt(2) >= /* 'A' */
      65 && key.charCodeAt(2) <= /* 'Z' */
      90) {
        result[key] = chain(a, b);
      } else if (key === "className" && typeof a === "string" && typeof b === "string") {
        result[key] = [a, b].join();
      } else {
        result[key] = b !== void 0 ? b : a;
      }
    }
  }
  return result;
}

// src/utils/index.ts
function noop() {
}
function clamp(min, value, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

// src/useCarouselState.ts
function useCarouselState(props, ref) {
  const {
    itemsPerPage = 1,
    scrollBy = "page",
    loop = false,
    children,
    collection: propCollection,
    items: collectionItems,
    initialPages = []
  } = props;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages, setPages] = useState(initialPages);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scroller = ref;
  const collection = useCarouselCollection({
    collection: propCollection,
    children,
    items: collectionItems
  });
  const getItems = useCallback(
    ({ includeClones } = { includeClones: false }) => {
      if (!scroller)
        return [];
      let allChildren = Array.from(scroller.children);
      if (includeClones)
        return allChildren;
      return allChildren.filter((child) => !child.hasAttribute("data-clone"));
    },
    [scroller]
  );
  const scrollToItem = useCallback(
    (slide, behavior = "smooth") => {
      if (!scroller)
        return;
      const scrollContainerRect = scroller.getBoundingClientRect();
      const nextSlideRect = slide.getBoundingClientRect();
      const nextLeft = nextSlideRect.left - scrollContainerRect.left;
      const nextTop = nextSlideRect.top - scrollContainerRect.top;
      scroller.scrollTo({
        left: nextLeft + scroller.scrollLeft,
        top: nextTop + scroller.scrollTop,
        behavior: prefersReducedMotion ? "instant" : behavior
      });
    },
    [prefersReducedMotion, scroller]
  );
  const scrollToPage = useCallback(
    (index, behavior) => {
      const items = getItems();
      const page = pages[index];
      const itemIndex = page?.[0];
      if (items[itemIndex]) {
        scrollToItem(items[itemIndex], behavior);
      }
    },
    [getItems, pages, scrollToItem]
  );
  const updateSnaps = useCallback(() => {
    const actualItemsPerPage = Math.floor(itemsPerPage);
    getItems({ includeClones: true }).forEach((item, index) => {
      const shouldSnap = scrollBy === "item" || (index + actualItemsPerPage) % actualItemsPerPage === 0;
      if (shouldSnap) {
        item.style.setProperty("scroll-snap-align", "start");
      } else {
        item.style.removeProperty("scroll-snap-align");
      }
    });
  }, [getItems, itemsPerPage, scrollBy]);
  const calculatePages = useCallback(() => {
    const items = getItems();
    const actualItemsPerPage = Math.floor(itemsPerPage);
    let newPages = items.reduce((acc, _, i) => {
      const currPage = acc.at(-1);
      if (currPage && currPage.length < actualItemsPerPage) {
        currPage.push(i);
      } else {
        acc.push([i]);
      }
      return acc;
    }, []);
    if (newPages.length >= 2) {
      let deficit = actualItemsPerPage - newPages.at(-1).length;
      if (deficit > 0) {
        const fill = [...newPages.at(-2)].splice(actualItemsPerPage - deficit);
        newPages.at(-1).unshift(...fill);
      }
    }
    setPages(newPages);
    setActivePageIndex((prev2) => {
      return clamp(0, prev2, newPages.length - 1);
    });
  }, [getItems, itemsPerPage]);
  const scrollToPageIndex = useCallback(
    (index) => {
      const items = getItems();
      const itemsWithClones = getItems({ includeClones: true });
      const pagesWithClones = [pages.at(-1), ...pages, pages[0]];
      if (!items.length)
        return -1;
      let nextItem, nextPageIndex, nextPage;
      if (loop === "infinite") {
        let nextIndex = clamp(-1, index, pagesWithClones.length);
        if (nextIndex < 0) {
          nextItem = itemsWithClones[0];
          nextPageIndex = pages.length - 1;
          nextPage = pages[nextPageIndex];
        } else if (nextIndex >= pages.length) {
          nextItem = itemsWithClones.at(-1 * itemsPerPage);
          nextPageIndex = 0;
          nextPage = pages[0];
        } else {
          nextPageIndex = nextIndex;
          nextPage = pages[nextIndex];
          nextItem = items[nextPage[0]];
        }
      } else if (loop === "native") {
        nextPageIndex = index > pages.length - 1 ? 0 : index < 0 ? pages.length - 1 : index;
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
    [getItems, itemsPerPage, loop, pages, scrollToItem]
  );
  const next = useCallback(() => {
    return scrollToPageIndex(activePageIndex + 1);
  }, [activePageIndex, scrollToPageIndex]);
  const prev = useCallback(() => {
    return scrollToPageIndex(activePageIndex - 1);
  }, [activePageIndex, scrollToPageIndex]);
  useEffect(() => {
    if (!scroller || pages.length === 0)
      return;
    getItems({ includeClones: true }).forEach((item) => {
      if (item.hasAttribute("data-clone")) {
        item.remove();
      }
    });
    if (loop === "infinite") {
      const items = getItems();
      const firstPage = pages[0];
      const lastPage = [...pages.at(-1)];
      if (firstPage === lastPage)
        return;
      lastPage.reverse().forEach((slide) => {
        const clone = items[slide].cloneNode(true);
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        scroller.prepend(clone);
      });
      firstPage.forEach((slide) => {
        const clone = items[slide].cloneNode(true);
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("inert", "true");
        clone.setAttribute("aria-hidden", "true");
        scroller.append(clone);
      });
    }
    updateSnaps();
    scrollToPage(activePageIndex, "instant");
  }, [
    // activePageIndex,
    getItems,
    loop,
    pages,
    scrollToPage,
    scroller,
    updateSnaps
  ]);
  useEffect(() => {
    if (!scroller)
      return;
    calculatePages();
    updateSnaps();
    const mutationObserver = new MutationObserver((mutations) => {
      const childrenChanged = mutations.some(
        (mutation) => (
          // @ts-expect-error This is fine
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            (el) => el.hasAttribute("data-carousel-item") && !el.hasAttribute("data-clone")
          )
        )
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
    if (!scroller)
      return;
    function handle() {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          intersectionObserver.disconnect();
          const firstIntersecting = entries.find(
            (entry) => entry.isIntersecting
          );
          if (firstIntersecting) {
            if (loop === "infinite" && firstIntersecting.target.hasAttribute("data-clone")) {
              const cloneIndex = firstIntersecting.target.getAttribute("data-carousel-item");
              const actualItem = getItems().find(
                (el) => el.getAttribute("data-carousel-item") === cloneIndex
              );
              scrollToItem(actualItem, "instant");
            } else {
              const indexString = firstIntersecting.target.dataset.carouselItem;
              if (process.env.NODE_ENV !== "production") {
                if (!indexString) {
                  throw new Error(
                    "Failed to find data-carousel-item HTML attribute on an item."
                  );
                }
              }
              const slideIndex = parseInt(indexString, 10);
              const activePage = pages.findIndex(
                (page) => page.includes(slideIndex)
              );
              setActivePageIndex(clamp(0, activePage, getItems().length));
            }
          }
        },
        {
          root: scroller,
          threshold: 0.6
        }
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
    scrollToPage
  };
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
function useAutoplay({
  enabled,
  interval,
  next
}) {
  const [playing, setPlaying] = useState(enabled);
  useInterval(
    () => requestAnimationFrame(next),
    enabled && playing ? interval : null
  );
  const pause = useCallback(() => {
    if (!enabled)
      return;
    setPlaying(false);
  }, [enabled]);
  const play = useCallback(() => {
    if (!enabled)
      return;
    setPlaying(true);
  }, [enabled]);
  useEffect(() => {
    function listener() {
      if (document.visibilityState === "hidden") {
        pause();
      } else {
        play();
      }
    }
    document.addEventListener("visibilitychange", listener);
    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [pause, play]);
  return {
    autoplaying: playing,
    setAutoplay: setPlaying,
    rootProps: {
      onMouseEnter: pause,
      onTouchStart: pause,
      onFocus: pause,
      onMouseLeave: play,
      onTouchEnd: play,
      onBlur: play
    }
  };
}
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

// src/useCarousel.ts
function useCarousel(props = {
  itemsPerPage: 1,
  loop: false,
  orientation: "horizontal",
  spaceBetweenItems: "0px",
  mouseDragging: false,
  autoplay: false,
  autoplayInterval: 5e3
}) {
  const {
    itemsPerPage = 1,
    loop = false,
    orientation = "horizontal",
    spaceBetweenItems: spaceBetweenSlides = "0px",
    scrollPadding,
    mouseDragging = false,
    autoplay: propAutoplay = false,
    autoplayInterval = 5e3
  } = props;
  const [host, setHost] = useState(null);
  const state = useCarouselState(props, host);
  const { pages, activePageIndex, next, prev, scrollToPage } = state;
  const scrollerId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    rootProps: autoplayRootProps,
    setAutoplay,
    autoplaying
  } = useAutoplay({
    enabled: !prefersReducedMotion && propAutoplay,
    interval: autoplayInterval,
    next
  });
  const handleKeyDown = useCallback(
    (e) => {
      if (![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(e.key))
        return;
      e.preventDefault();
      let nextPageIndex;
      switch (e.key) {
        case "ArrowUp": {
          if (orientation === "vertical") {
            nextPageIndex = prev();
          }
          break;
        }
        case "ArrowRight": {
          if (orientation === "horizontal") {
            nextPageIndex = next();
          }
          break;
        }
        case "ArrowDown": {
          if (orientation === "vertical") {
            nextPageIndex = next();
          }
          break;
        }
        case "ArrowLeft": {
          if (orientation === "horizontal") {
            nextPageIndex = prev();
          }
          break;
        }
        case "Home": {
          scrollToPage(0);
          nextPageIndex = 0;
          break;
        }
        case "End": {
          scrollToPage(pages.length - 1);
          nextPageIndex = pages.length - 1;
          break;
        }
      }
      return nextPageIndex;
    },
    [next, orientation, pages.length, prev, scrollToPage]
  );
  const handleNavKeydown = useCallback(
    (e) => {
      const nextIndex = handleKeyDown(e);
      if (!nextIndex)
        return;
      const target = e.target;
      if (document.activeElement === target || document.activeElement?.contains(target)) {
        const navItem = document.querySelector(
          `[data-carousel-nav-item="${nextIndex}"]`
        );
        navItem?.focus();
      }
    },
    [handleKeyDown]
  );
  useAriaBusyScroll(host);
  const {
    scrollerProps: { onMouseDown }
  } = useMouseDrag(host);
  return [
    setHost,
    {
      ...state,
      rootProps: {
        ...autoplayRootProps,
        role: "region",
        "aria-roledescription": "carousel"
      },
      navProps: {
        role: "tablist",
        "aria-controls": scrollerId,
        "aria-orientation": orientation,
        "aria-label": "Carousel navigation",
        onKeyDown: handleNavKeydown
      },
      prevButtonProps: {
        "aria-label": "Previous page",
        "aria-controls": scrollerId,
        "data-prev-button": true,
        onClick: () => prev(),
        disabled: loop ? false : activePageIndex <= 0
      },
      nextButtonProps: {
        "aria-label": "Next page",
        "aria-controls": scrollerId,
        "data-next-button": true,
        onClick: () => next(),
        disabled: loop ? false : activePageIndex >= pages.length - 1
      },
      scrollerProps: {
        "aria-label": "Items Scroller",
        "data-orientation": orientation,
        onMouseDown: mouseDragging ? onMouseDown : noop,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        "aria-atomic": true,
        "aria-live": "polite",
        "aria-busy": false,
        id: scrollerId,
        role: "group",
        style: {
          [orientation === "horizontal" ? "gridAutoColumns" : "gridAutoRows"]: `calc(100% / ${itemsPerPage} - ${spaceBetweenSlides} * ${itemsPerPage - 1} / ${itemsPerPage})`,
          gap: spaceBetweenSlides,
          [orientation === "horizontal" ? "scrollPaddingInline" : "scrollPaddingBlock"]: scrollPadding,
          [orientation === "horizontal" ? "paddingInline" : "paddingBlock"]: scrollPadding
        }
      },
      autoplayControlProps: {
        inert: !propAutoplay ? "true" : void 0,
        "aria-pressed": autoplaying,
        "aria-label": autoplaying ? "Disable autoplay" : "Enable autoplay",
        "aria-controls": scrollerId,
        onClick() {
          setAutoplay((prev2) => !prev2);
        }
      }
    }
  ];
}

// src/useCarouselNavItem.ts
function useCarouselNavItem(props, state) {
  const isSelected = props.isSelected ?? state.activePageIndex === props.index;
  let current = props.index + 1, setSize = state.pages.length;
  return {
    navItemProps: {
      "data-carousel-nav-item": props.index,
      role: "tab",
      "aria-label": `Go to item ${current} of ${setSize}`,
      "aria-posinset": current,
      "aria-setsize": setSize,
      "aria-selected": isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => state.scrollToPage(props.index)
    },
    isSelected
  };
}

// src/useCarouselItem.ts
function useCarouselItem(props, state) {
  const { item } = props;
  const { pages, activePageIndex, scrollBy, itemsPerPage } = state;
  const actualItemsPerPage = Math.floor(itemsPerPage);
  const shouldSnap = scrollBy === "item" || (item.index + actualItemsPerPage) % actualItemsPerPage === 0;
  const label = item["aria-label"] || `${item.index + 1} of ${state.collection.size}`;
  const isInert = pages[activePageIndex]?.includes(item.index);
  return {
    itemProps: {
      "data-carousel-item": item.index,
      inert: isInert ? void 0 : "true",
      "aria-hidden": isInert ? void 0 : true,
      "aria-roledescription": "carousel item",
      "aria-label": label,
      style: {
        scrollSnapAlign: shouldSnap ? "start" : void 0
      }
    }
  };
}
var WrappedItem = Item;
var Context = createContext(void 0);
var useCarouselContext = () => useContext(Context);
function Carousel({
  children,
  spaceBetweenItems,
  scrollPadding,
  mouseDragging,
  autoplay,
  autoplayInterval,
  itemsPerPage,
  loop,
  orientation,
  scrollBy,
  initialPages,
  ...props
}) {
  const [carouselChildren, setCarouselChildren] = useState();
  const carouselProps = {
    spaceBetweenItems,
    scrollPadding,
    mouseDragging,
    autoplay,
    autoplayInterval,
    itemsPerPage,
    loop,
    orientation,
    scrollBy,
    initialPages
  };
  const [assignRef, carouselState] = useCarousel({
    ...carouselProps,
    children: carouselChildren
  });
  return /* @__PURE__ */ jsx(
    Context.Provider,
    {
      value: {
        setCarouselChildren,
        assignRef,
        carouselState,
        carouselProps
      },
      children: /* @__PURE__ */ jsx("div", { ...mergeProps$1(carouselState.rootProps, props), children })
    }
  );
}
function CarouselTabs({ children, ...props }) {
  const { carouselState } = useCarouselContext();
  return /* @__PURE__ */ jsx("div", { ...mergeProps$1(carouselState?.navProps, props), children: carouselState?.pages.map((_, index) => /* @__PURE__ */ jsx(Fragment, { children: children({
    isSelected: index === carouselState?.activePageIndex,
    index
  }) }, index)) });
}
function CarouselTab(props) {
  const { carouselState } = useCarouselContext();
  const { index } = props;
  const { navItemProps } = useCarouselNavItem({ index }, carouselState);
  return /* @__PURE__ */ jsx("button", { type: "button", ...mergeProps$1(navItemProps, props) });
}
function CarouselButton({ dir, ...props }) {
  const { carouselState } = useCarouselContext();
  const buttonProps = dir === "prev" ? carouselState?.prevButtonProps : carouselState?.nextButtonProps;
  return /* @__PURE__ */ jsx("button", { type: "button", ...mergeProps$1(buttonProps, props) });
}
function CarouselScroller(props) {
  const context = useCarouselContext();
  const { assignRef, setCarouselChildren, carouselState } = context;
  useEffect(() => {
    setCarouselChildren(props.children);
  }, [props.children, setCarouselChildren]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: assignRef,
      ...mergeProps(carouselState?.scrollerProps, props),
      style: { ...carouselState?.scrollerProps.style, ...props?.style },
      children: [...carouselState?.collection || []].map((item) => /* @__PURE__ */ jsx(CarouselItem, { item, state: carouselState }, item.key))
    }
  );
}
function CarouselItem(props) {
  const { item, state } = props;
  const { itemProps } = useCarouselItem(props, state);
  return /* @__PURE__ */ jsx("div", { ...itemProps, children: item.rendered });
}
function CarouselAutoplayControl(props) {
  const { carouselState } = useCarouselContext();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      ...mergeProps$1(carouselState?.autoplayControlProps, props)
    }
  );
}

export { Carousel, CarouselAutoplayControl, CarouselButton, WrappedItem as CarouselItem, CarouselScroller, CarouselTab, CarouselTabs, WrappedItem as Item, useCarousel, useCarouselItem, useCarouselNavItem };
