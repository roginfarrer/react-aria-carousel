import {
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useId,
  useRef,
} from "react";
import {
  UseCarouselResult,
  type UseCarouselStateOptions,
} from "./useCarouselState.js";
import { announce } from "@react-aria/live-announcer";
import { flatten } from "./internal/utils.js";
import { useRefs } from "./carousel-context.js";

interface UseCarouselOptions extends UseCarouselStateOptions {
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

const defaultProps = {
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
};

export function useCarousel(
  options: UseCarouselOptions,
  state: UseCarouselResult,
) {
  const {
    text: { multiItemAnnouncement, singleItemAnnouncement },
    visibleItems,
    spaceBetweenItems,
    orientation,
  } = {
    ...defaultProps,
    ...options,
    text: {
      ...defaultProps.text,
      ...options.text,
    },
  };

  const { pages, activePageIndex } = state;

  // Because we're announcing the change on scroll, we need to dedupe the message
  // so we're not blasting the queue of announcements on every pixel shift
  const lastAnnounced = useRef<{ index: number; length: number }>({
    index: activePageIndex,
    length: pages.length,
  });

  useEffect(() => {
    if (
      lastAnnounced.current.index !== activePageIndex ||
      lastAnnounced.current.length !== pages.length
    ) {
      const inView = pages[activePageIndex];
      if (!inView) return;
      const firstItem = inView[0];
      const lastItem = inView[inView.length - 1];
      if (firstItem === lastItem) {
        announce(
          singleItemAnnouncement({
            currentItem: activePageIndex + 1,
            itemCount: pages.length,
          }),
          "polite",
        );
      } else {
        announce(
          multiItemAnnouncement({
            currentItem: firstItem + 1,
            itemsPerPage: lastItem + 1,
            itemCount: flatten(pages).length,
          }),
          "polite",
        );
      }
      lastAnnounced.current = {
        index: activePageIndex,
        length: pages.length,
      };
    }
  }, [activePageIndex, multiItemAnnouncement, pages, singleItemAnnouncement]);

  // const carouselState = useCarouselState({
  //   ...options,
  //   state,
  //   setState(prevState) {
  //     const args =
  //       typeof prevState === "function" ? prevState(state) : prevState;
  //     handleAnnouncements(args);
  //     setState(prevState);
  //     options.setState?.(prevState);
  //   },
  // });

  const handleRootKeyDown: KeyboardEventHandler = (e) => {
    function forward() {
      e.preventDefault();
      const nav = state.refs.nav.current;
      const nextIndex = state.scrollToNextPage();
      if (nav?.contains(e.target as Node)) {
        const items = Array.from(nav.children);
        const nextItem = items[nextIndex] as HTMLElement | undefined;
        nextItem?.focus();
      } else if (
        !options.enableLoopPagination &&
        nextIndex >= pages.length - 1
      ) {
        state.refs.prevButton.current?.focus();
      } else {
        state.refs.nextButton.current?.focus();
      }
    }
    function backward() {
      e.preventDefault();
      const nextIndex = state.scrollToPreviousPage();
      if (state.refs.nav.current?.contains(e.target as Node)) {
        const items = Array.from(state.refs.nav.current.children);
        const nextItem = items[nextIndex] as HTMLElement | undefined;
        nextItem?.focus();
      } else if (!options.enableLoopPagination && nextIndex <= 0) {
        state.refs.prevButton.current?.focus();
      } else {
        state.refs.nextButton.current?.focus();
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

  return {
    carouselProps: {
      onKeyDown: handleRootKeyDown,
    },
    navProps: {
      role: "tablist",
      // ref: state.setRefs.setNavRef,
    },
    carouselScrollerProps: {
      "data-orientation": orientation,
      style: {
        [orientation === "horizontal" ? "gridAutoColumns" : "gridAutoRows"]:
          `calc(100% / ${visibleItems} - ${spaceBetweenItems} * ${visibleItems - 1} / ${visibleItems})`,
      },
    },
    prevButtonProps: {
      // ref: state.setRefs.setPrevButtonRef,
      "data-prev-button": true,
      onClick: () => state.scrollToPreviousPage(),
      disabled: options.enableLoopPagination ? false : activePageIndex <= 0,
      "aria-label": "Previous Item",
    },
    nextButtonProps: {
      // ref: state.setRefs.setNextButtonRef,
      "data-next-button": true,
      "aria-label": "Next Item",
      onClick: () => state.scrollToNextPage(),
      disabled: options.enableLoopPagination
        ? false
        : activePageIndex >= pages.length - 1,
    },
  };
}
