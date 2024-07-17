"use client";

import {
  Dispatch,
  KeyboardEvent,
  KeyboardEventHandler,
  SetStateAction,
  useCallback,
  useId,
  useState,
} from "react";

import {
  CarouselState,
  CarouselStateProps,
  useCarouselState,
} from "./useCarouselState";
import {
  Attributes,
  noop,
  useAriaBusyScroll,
  useMouseDrag,
  usePrefersReducedMotion,
} from "./utils";
import { useAutoplay } from "./utils/useAutoplay";

/**
 * Options for useCarousel
 */
export interface CarouselOptions extends CarouselStateProps {
  /**
   * The gap between items.
   * @defaultValue '0px'
   */
  spaceBetweenItems?: string;
  /**
   * The amount of padding to apply to the scroll area, allowing adjacent items
   * to become partially visible.
   */
  scrollPadding?: string;
  /**
   * Controls whether the user can scroll by clicking and dragging with their mouse.
   * @default false
   */
  mouseDragging?: boolean;
  /**
   * If true, the carousel will scroll automatically when the user is not interacting with it.
   * @default false
   */
  autoplay?: boolean;
  /**
   * Specifies the amount of time, in milliseconds, between each automatic scroll.
   * @default 5000
   */
  autoplayInterval?: number;
}

/**
 * API returned by useCarousel
 */
export interface CarouselAria extends CarouselState {
  autoplayUserPreference: boolean;
  /** Props for the tab list element */
  readonly tablistProps: Attributes<"div">;
  /** Props for the root element */
  readonly rootProps: Attributes<"div">;
  /** Props for the previous button element */
  readonly prevButtonProps: Attributes<"button">;
  /** Props for the next button element */
  readonly nextButtonProps: Attributes<"button">;
  /** Props for the scroller element */
  readonly scrollerProps: Attributes<"div">;
  /** Props for the autoplay toggle element */
  readonly autoplayControlProps: Attributes<"button">;
}

export function useCarousel({
  itemsPerPage = 1,
  loop = false,
  orientation = "horizontal",
  spaceBetweenItems = "0px",
  mouseDragging = false,
  autoplay: propAutoplay = false,
  autoplayInterval = 5000,
  scrollPadding,
  onActivePageIndexChange,
}: CarouselOptions = {}): [
  Dispatch<SetStateAction<HTMLElement | null>>,
  CarouselAria,
] {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const {
    isDraggingRef,
    scrollerProps: { onMouseDown },
  } = useMouseDrag(host);
  const state = useCarouselState(
    {
      itemsPerPage,
      loop,
      mouseDragging,
      isDraggingRef,
      onActivePageIndexChange,
    },
    host,
  );
  const { pages, activePageIndex, next, prev, scrollToPage } = state;
  const scrollerId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    rootProps: autoplayRootProps,
    autoplayUserPreference,
    setAutoplayUserPreference,
  } = useAutoplay({
    enabled: !prefersReducedMotion && propAutoplay,
    interval: autoplayInterval,
    next,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): number | undefined => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(e.key)
      )
        return;

      e.preventDefault();
      let nextPageIndex: number | undefined;

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
    [next, orientation, pages.length, prev, scrollToPage],
  );

  const handleTablistKeydown: KeyboardEventHandler = useCallback(
    (e) => {
      const nextIndex = handleKeyDown(e);
      if (!nextIndex) return;

      const target = e.target as HTMLElement;
      if (
        document.activeElement === target ||
        document.activeElement?.contains(target)
      ) {
        const tab = document.querySelector(
          `[data-carousel-tab="${nextIndex}"]`,
        ) as HTMLElement | null;
        tab?.focus();
      }
    },
    [handleKeyDown],
  );

  useAriaBusyScroll(host);

  return [
    setHost,
    {
      ...state,
      autoplayUserPreference,
      rootProps: {
        ...autoplayRootProps,
        role: "region",
        "aria-roledescription": "carousel",
      },
      tablistProps: {
        role: "tablist",
        "aria-controls": scrollerId,
        "aria-orientation": orientation,
        "aria-label": "Carousel navigation",
        onKeyDown: handleTablistKeydown,
      },
      prevButtonProps: {
        "aria-label": "Previous page",
        "aria-controls": scrollerId,
        "data-prev-button": true,
        onClick: () => prev(),
        "aria-disabled": loop
          ? undefined
          : activePageIndex <= 0
            ? true
            : undefined,
      },
      nextButtonProps: {
        "aria-label": "Next page",
        "aria-controls": scrollerId,
        "data-next-button": true,
        onClick: () => next(),
        "aria-disabled": loop
          ? undefined
          : activePageIndex >= pages.length - 1
            ? true
            : undefined,
      },
      scrollerProps: {
        "data-carousel-scroller": true,
        "aria-label": "Items Scroller",
        "data-orientation": orientation,
        onMouseDown: mouseDragging ? onMouseDown : noop,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        "aria-atomic": true,
        "aria-live": propAutoplay && autoplayUserPreference ? "polite" : "off",
        "aria-busy": false,
        id: scrollerId,
        role: "group",
        style: {
          [`gridAuto${orientation === "horizontal" ? "Columns" : "Rows"}`]: `calc(100% / ${itemsPerPage} - ${spaceBetweenItems} * ${itemsPerPage - 1} / ${itemsPerPage})`,
          [`scrollPadding${orientation === "horizontal" ? "Inline" : "Block"}`]:
            scrollPadding,
          [`padding${orientation === "horizontal" ? "Inline" : "Block"}`]:
            scrollPadding,
          gap: spaceBetweenItems,
        },
      },
      autoplayControlProps: {
        inert: !propAutoplay ? "true" : undefined,
        "aria-label": autoplayUserPreference
          ? "Disable autoplay"
          : "Enable autoplay",
        "aria-controls": scrollerId,
        onClick() {
          setAutoplayUserPreference((prev) => !prev);
        },
      },
    },
  ];
}
