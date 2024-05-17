import { createContext, useContext } from "react";

import { CarouselAria, CarouselOptions } from "./useCarousel";

interface ContextType {
  carouselState: CarouselAria;
  carouselProps: CarouselOptions;
  assignRef: (instance: HTMLElement | null) => void;
}

// @ts-expect-error purposefully undefined
export const Context = createContext<ContextType>(undefined);

export const useCarouselContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("react-aria-carousel: No Carousel found in the React tree");
  }
  return context;
};

export const IndexContext = createContext<number>(-1);
