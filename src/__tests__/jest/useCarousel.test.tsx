import { renderHook } from "@testing-library/react-hooks";
import { test, expect } from "vitest";
import { useCarousel } from "../../useCarousel";

test("returns expected properties", () => {
  const { result } = renderHook(() => useCarousel());
  const {
    scrollTo,
    scrollToNextPage,
    scrollToPreviousPage,
    isPolyfillScrolling,
    orientation,
    assignScrollerEl,
    scrollerEl,
    scrollIntoView,
    scrollPosition,
    refresh,
    activePageIndex,
    snapPointIndexes,
    getItemProps,
    getNavItemProps,
    getNavProps,
    handleRootElKeydown,
    pages,
    refs,
  } = result.current;

  expect(typeof scrollTo).toBe("function");
  expect(typeof scrollToNextPage).toBe("function");
  expect(typeof scrollToPreviousPage).toBe("function");
  expect(typeof scrollIntoView).toBe("function");
  expect(typeof refresh).toBe("function");
  expect(typeof assignScrollerEl).toBe("function");
  expect(typeof handleRootElKeydown).toBe("function");
  expect(typeof getItemProps({ index: 0 })).toBe("object");
  expect(typeof getNavItemProps({ index: 0 })).toBe("object");
  expect(typeof getItemProps({ index: 0 })).toBe("object");
  expect(typeof getNavProps()).toBe("object");

  expect(isPolyfillScrolling).toBe(false);
  expect(orientation).toBe("horizontal");
  expect(scrollPosition).toBe("start");
  expect(activePageIndex).toBe(0);
  expect(snapPointIndexes).toEqual(new Set());
  expect(pages).toEqual([]);
  expect(scrollerEl).toBe(null);

  expect(refs).toMatchInlineSnapshot(`
    Object {
      "setNavRef": [Function],
      "setNextButtonRef": [Function],
      "setPrevButtonRef": [Function],
    }
  `);
});
