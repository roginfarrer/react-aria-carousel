import { createContext } from "./createContext";
import { UseCarouselResult } from "../useCarousel";
import { Key, useRef, useMemo } from "react";

export type Item = { id?: Key | null; key?: Key | null; [k: string]: any };

export const [ItemContextProvider, useItemContext] = createContext<Item>({
  name: "CarouselItemContext",
  strict: false,
});

export interface CarouselContext<T extends Item> extends UseCarouselResult {
  /**
   * If 'item', the carousel will snap to each individual item when scrolling.
   * If 'page', the carousel will snap to each page when scrolling.
   */
  snapAnchor?: "item" | "page";
  /** Array of objects used to render each item of the carousel. */
  items?: T[];
  /** A function that returns a unique key for an item object. */
  getItemKey: (item: T) => Key;
  /**
   * If true, scrollToNextPage and scrollToPreviousPage will scroll to the beginning or
   * end respectively when at either end.
   */
  enableLoopPagination: boolean;
}

export const [CarouselContextProvider, useCarouselContext] = createContext<
  CarouselContext<any>
>({
  name: "CarouselContext",
  errorMessage: "Carousel component missing provider",
});

/**
 * Determines whether the browser supports smooth scrolling
 * Safari!!! :shakes-fist:
 */
export function getCanSmoothScroll() {
  return (
    typeof window !== "undefined" &&
    "scrollBehavior" in document.documentElement.style
  );
}

/**
 * Whether the browser supports smooth scrolling
 * Safari!!! :shakes-fist:
 */
export const canSmoothScroll = getCanSmoothScroll();

/**
 * Calculates a duration based on the distance to scroll
 * This yields a more natural scroll according to the distance
 */
export function getPolyfillScrollDuration(distance: number) {
  const constant = distance / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function useCarouselElementRefs() {
  const prevButton = useRef<HTMLElement | null>(null);
  const nextButton = useRef<HTMLElement | null>(null);
  const nav = useRef<HTMLElement | null>(null);

  return useMemo(
    () =>
      [
        {
          prevButton,
          nextButton,
          nav,
        },
        {
          setPrevButtonRef(node: HTMLElement | null) {
            prevButton.current = node;
          },
          setNextButtonRef(node: HTMLElement | null) {
            nextButton.current = node;
          },
          setNavRef(node: HTMLElement | null) {
            nav.current = node;
          },
        },
      ] as const,
    [],
  );
}

/** In case we're in environments that don't support Array.flat() */
export function flatten<T>(arr: T[][]) {
  if ("flat" in Array.prototype) {
    return arr.flat(1);
  }
  return arr.reduce((acc, cur) => acc.concat(cur), []);
}
