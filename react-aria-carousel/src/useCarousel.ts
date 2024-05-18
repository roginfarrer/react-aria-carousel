"use client";

import "./utils/scrollend-polyfill";

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

export interface CarouselAria extends CarouselState {
  autoplayUserPreference: boolean;
  /** Props for the navlist element */
  readonly navProps: Attributes<"div">;
  /** Props for the root element */
  readonly rootProps: Attributes<"div">;
  /** Props for the previous button element */
  readonly prevButtonProps: Attributes<"button">;
  /** Props for the next button element */
  readonly nextButtonProps: Attributes<"button">;
  /** Props for the scroller element */
  readonly scrollerProps: Attributes<"div">;
  readonly autoplayControlProps: Attributes<"button">;
}

export function useCarousel(
  props: CarouselOptions = {
    itemsPerPage: 1,
    loop: false,
    orientation: "horizontal",
    spaceBetweenItems: "0px",
    mouseDragging: false,
    autoplay: false,
    autoplayInterval: 5000,
  },
): [Dispatch<SetStateAction<HTMLElement | null>>, CarouselAria] {
  const {
    itemsPerPage = 1,
    loop = false,
    orientation = "horizontal",
    spaceBetweenItems: spaceBetweenSlides = "0px",
    scrollPadding,
    mouseDragging = false,
    autoplay: propAutoplay = false,
    autoplayInterval = 5000,
  } = props;
  const [host, setHost] = useState<HTMLElement | null>(null);
  const state = useCarouselState(props, host);
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

  const handleNavKeydown: KeyboardEventHandler = useCallback(
    (e) => {
      const nextIndex = handleKeyDown(e);
      if (!nextIndex) return;

      const target = e.target as HTMLElement;
      if (
        document.activeElement === target ||
        document.activeElement?.contains(target)
      ) {
        const navItem = document.querySelector(
          `[data-carousel-nav-item="${nextIndex}"]`,
        ) as HTMLElement | null;
        navItem?.focus();
      }
    },
    [handleKeyDown],
  );

  useAriaBusyScroll(host);
  const {
    scrollerProps: { onMouseDown },
  } = useMouseDrag(host);

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
      navProps: {
        role: "tablist",
        "aria-controls": scrollerId,
        "aria-orientation": orientation,
        "aria-label": "Carousel navigation",
        onKeyDown: handleNavKeydown,
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
        "data-carousel-scroller": true,
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
          [orientation === "horizontal" ? "gridAutoColumns" : "gridAutoRows"]:
            `calc(100% / ${itemsPerPage} - ${spaceBetweenSlides} * ${itemsPerPage - 1} / ${itemsPerPage})`,
          gap: spaceBetweenSlides,
          [orientation === "horizontal"
            ? "scrollPaddingInline"
            : "scrollPaddingBlock"]: scrollPadding,
          [orientation === "horizontal" ? "paddingInline" : "paddingBlock"]:
            scrollPadding,
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
