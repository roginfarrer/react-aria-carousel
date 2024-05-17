import { createContext, useContext } from "react";
import { CollectionChildren } from "@react-types/shared";

import { CarouselAria, CarouselOptions } from "./useCarousel";

interface ContextType<T extends object> {
  carouselState?: CarouselAria<T>;
  setCarouselChildren: (state: CollectionChildren<T>) => void;
  carouselProps: CarouselOptions<T>;
  assignRef: (instance: HTMLElement | null) => void;
}

// @ts-expect-error Intentionally undefined
export const Context = createContext<ContextType<any>>(undefined);

export const useCarouselContext = () => useContext(Context);
