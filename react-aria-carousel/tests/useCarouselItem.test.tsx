import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

import { useCarouselItem } from "../src";

test("useCarouselItem errors without context", () => {
  expect(() => renderHook(() => useCarouselItem({ index: 0 }))).toThrowError();
});
