export class MouseWatcher {
  dragging: boolean = false;

  constructor(options: { getScrollerElement: () => HTMLElement | null }) {
    this.options = options;
  }

  handleDragging = (event: PointerEvent) => {
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
  };

  handleDragEnd = () => {
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

    this.dragging = false;
  };

  private handleDragStart = (event: MouseEvent) => {
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
  };

  public cleanup = () => {
    document.removeEventListener("pointermove", handleDragging, {
      capture: true,
    });
    document.removeEventListener("pointerup", handleDragEnd, {
      capture: true,
    });
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
