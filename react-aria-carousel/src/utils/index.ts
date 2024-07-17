import { ComponentPropsWithoutRef, ElementType } from "react";

export * from "./useAriaBusyScroll";
export * from "./useMouseDrag";
export * from "./useCallbackRef";
export * from "./usePrefersReducedMotion";
export * from "./useMergedRef";
export * from "./mergeProps";

export type Attributes<T extends ElementType> = ComponentPropsWithoutRef<T> &
  Partial<Record<`data-${string}`, string | number | boolean>> & {
    inert?: string;
  };

export function noop() {}

export function clamp(min: number, value: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
