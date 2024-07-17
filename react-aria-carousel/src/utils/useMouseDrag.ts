/**
 * Copyright (c) 2020 A Beautiful Site, LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { MouseEventHandler, useCallback, useEffect, useRef } from "react";

export function useMouseDrag(host?: HTMLElement | null) {
  const dragging = useRef(false);

  const handleDragging = useCallback(
    (event: PointerEvent) => {
      if (!host) return;

      if (!dragging.current) {
        host.style.setProperty("scroll-snap-type", "none");
        dragging.current = true;
      }

      host.scrollBy({
        left: -event.movementX,
        top: -event.movementY,
        behavior: "instant",
      });
    },
    [host],
  );

  const handleDragEnd = useCallback(() => {
    if (!host) return;

    document.removeEventListener("pointermove", handleDragging, {
      capture: true,
    });

    // get the current scroll position
    const startLeft = host.scrollLeft;
    const startTop = host.scrollTop;

    // remove the scroll-snap-type property so that the browser will snap the slide to the correct position
    host.style.removeProperty("scroll-snap-type");

    // fix(safari): forcing a style recalculation doesn't seem to immediately update the scroll
    // position in Safari. Setting "overflow" to "hidden" should force this behavior.
    host.style.setProperty("overflow", "hidden");

    // get the final scroll position to the slide snapped by the browser
    const finalLeft = host.scrollLeft;
    const finalTop = host.scrollTop;

    // restore the scroll position to the original one, so that it can be smoothly animated if needed
    host.style.removeProperty("overflow");
    host.style.setProperty("scroll-snap-type", "none");
    host.scrollTo({ left: startLeft, top: startTop, behavior: "instant" });

    requestAnimationFrame(async () => {
      if (startLeft !== finalLeft || startTop !== finalTop) {
        host.scrollTo({
          left: finalLeft,
          top: finalTop,
          behavior: "smooth",
        });
        await waitForEvent(host, "scrollend");
      }

      host.style.removeProperty("scroll-snap-type");
    });

    dragging.current = false;
  }, [handleDragging, host]);

  const handleDragStart: MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (!host) return;
      // Primary click (usually left-click)
      let canDrag = event.button === 0;
      if (canDrag) {
        event.preventDefault();

        document.addEventListener("pointermove", handleDragging, {
          capture: true,
          passive: true,
        });
        document.addEventListener("pointerup", handleDragEnd, {
          capture: true,
          once: true,
        });
      }
    },
    [handleDragEnd, handleDragging, host],
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", handleDragging, {
        capture: true,
      });
      document.removeEventListener("pointerup", handleDragEnd, {
        capture: true,
      });
    };
  }, [handleDragEnd, handleDragging]);

  return {
    isDraggingRef: dragging,
    scrollerProps: {
      onMouseDown: handleDragStart,
    },
  };
}

export function waitForEvent(el: HTMLElement, eventName: string) {
  return new Promise<void>((resolve) => {
    function done(event: Event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }

    el.addEventListener(eventName, done);
  });
}
