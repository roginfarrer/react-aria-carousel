import {
  ComponentPropsWithoutRef,
  Dispatch,
  ElementType,
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
import { getNavItem, getNavList, getNextButton, getPrevButton } from "./utils";
import { useAriaBusyScroll } from "./utils/useAriaBusyScroll";

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
