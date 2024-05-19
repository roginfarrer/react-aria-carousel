import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

import { useCarousel } from "../src";

test("useCarousel returns", () => {
  const { result } = renderHook(() => useCarousel());
  const [assignRef, carousel] = result.current;
  expect(typeof assignRef).toBe("function");
  expect(typeof carousel.activePageIndex).toBe("number");
  expect(typeof carousel.prev).toBe("function");
  expect(typeof carousel.next).toBe("function");
  expect(Array.isArray(carousel.pages)).toBe(true);
  expect(carousel.prevButtonProps).toMatchInlineSnapshot(`
    {
      "aria-controls": ":r0:",
      "aria-label": "Previous page",
      "data-prev-button": true,
      "disabled": true,
      "onClick": [Function],
    }
  `);
  expect(carousel.nextButtonProps).toMatchInlineSnapshot(`
    {
      "aria-controls": ":r0:",
      "aria-label": "Next page",
      "data-next-button": true,
      "disabled": true,
      "onClick": [Function],
    }
  `);
  expect(carousel.rootProps).toMatchInlineSnapshot(`
    {
      "aria-roledescription": "carousel",
      "onBlur": [Function],
      "onFocus": [Function],
      "onMouseEnter": [Function],
      "onMouseLeave": [Function],
      "onTouchEnd": [Function],
      "onTouchStart": [Function],
      "role": "region",
    }
  `);
  expect(carousel.scrollerProps).toMatchInlineSnapshot(`
    {
      "aria-atomic": true,
      "aria-busy": false,
      "aria-label": "Items Scroller",
      "aria-live": "off",
      "data-carousel-scroller": true,
      "data-orientation": "horizontal",
      "id": ":r0:",
      "onKeyDown": [Function],
      "onMouseDown": [Function],
      "role": "group",
      "style": {
        "gap": "0px",
        "gridAutoColumns": "calc(100% / 1 - 0px * 0 / 1)",
        "paddingInline": undefined,
        "scrollPaddingInline": undefined,
      },
      "tabIndex": 0,
    }
  `);
  expect(carousel.navProps).toMatchInlineSnapshot(`
    {
      "aria-controls": ":r0:",
      "aria-label": "Carousel navigation",
      "aria-orientation": "horizontal",
      "onKeyDown": [Function],
      "role": "tablist",
    }
  `);
  expect(carousel.autoplayControlProps).toMatchInlineSnapshot(`
    {
      "aria-controls": ":r0:",
      "aria-label": "Enable autoplay",
      "inert": "true",
      "onClick": [Function],
    }
  `);
  expect(carousel.scrollBy).toBe("page");
  expect(carousel.autoplayUserPreference).toBe(false);
  expect(typeof carousel.scrollToPage).toBe("function");
});
