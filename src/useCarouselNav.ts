import { useRef } from "./carousel-context.js";

export function useCarouselNav<RefKey extends string = "ref">(props?: {
  refKey: RefKey;
}): { carouselNavProps: { [K in RefKey]: ReturnType<typeof useRef> } } {
  const setRef = useRef("nav");

  return {
    carouselNavProps: { [props.refKey]: setRef } as any,
  };
}
