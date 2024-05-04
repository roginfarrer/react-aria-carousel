import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { createRefContext } from "./useRefCollection.js";

export interface CarouselContext {
  /**
   * If 'item', the carousel will snap to each individual item when scrolling.
   * If 'page', the carousel will snap to each page when scrolling.
   */
  snapAnchor?: "item" | "page";
  /**
   * If true, scrollToNextPage and scrollToPreviousPage will scroll to the beginning or
   * end respectively when at either end.
   */
  enableLoopPagination: boolean;
  state: { pages: number[][]; activePageIndex: number };
  setState: Dispatch<
    SetStateAction<{ pages: number[][]; activePageIndex: number }>
  >;
}

const Context = createContext<CarouselContext>(undefined);

export const useCarouselContext = () => useContext(Context);

export const CarouselProvider = ({ children, state }) => {
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export const { RefProvider, useRef, useRefs } = createRefContext<{
  prevButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  nav: HTMLElement;
}>();
