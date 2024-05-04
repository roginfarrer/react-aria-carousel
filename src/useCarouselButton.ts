import { useRef } from "./carousel-context.js";

export function useCarouselPreviousButton<
  RefKey extends string = "ref",
>(props?: {
  refKey: RefKey;
}): { previousButtonProps: { [K in RefKey]: ReturnType<typeof useRef> } } {
  const setRef = useRef("prevButton");

  return {
    previousButtonProps: { [props.refKey]: setRef } as any,
  };
}

export function useCarouselNextButton<RefKey extends string = "ref">(props?: {
  refKey: RefKey;
}): { nextButtonProps: { [K in RefKey]: ReturnType<typeof useRef> } } {
  const setRef = useRef("nextButton");

  return {
    nextButtonProps: { [props.refKey]: setRef } as any,
  };
}
