import {
  getEffectiveScrollSpacing,
  getOffsetRect,
} from "./internal/dimensions.js";

export function getNextButton(host: HTMLElement) {
  return host.querySelector("[data-next-button]") as HTMLElement | undefined;
}
export function getPrevButton(host: HTMLElement) {
  return host.querySelector("[data-prev-button]") as HTMLElement | undefined;
}
export function getItems(host: HTMLElement) {
  return Array.from(
    host.querySelectorAll("[data-carousel-item]") as NodeListOf<HTMLElement>,
  );
}
export function getNavList(host: HTMLElement) {
  return host.querySelector("[data-carousel-nav]") as HTMLElement | undefined;
}

export function genItemId(id: string, idx: number) {
  return `${id}-${idx}`;
}

export function collectPages({
  host,
  orientation,
}: {
  host: HTMLElement;
  orientation: "vertical" | "horizontal";
}): number[][] {
  const farSidePos = orientation === "horizontal" ? "right" : "bottom";
  const dimension = orientation === "horizontal" ? "width" : "height";
  const nearSidePos = orientation === "horizontal" ? "left" : "top";

  const items = Array.from(host.children);
  const scrollPort = host.getBoundingClientRect();
  let currPageStartPos: number;
  const pages = items.reduce<number[][]>((acc, node, i) => {
    const currPage = acc[acc.length - 1];
    const rect = getOffsetRect(node, node.parentElement);
    if (
      !currPage ||
      rect[farSidePos] - currPageStartPos > Math.ceil(scrollPort[dimension])
    ) {
      acc.push([i]);
      const scrollSpacing = getEffectiveScrollSpacing(
        host,
        node as HTMLElement,
        nearSidePos,
      );
      currPageStartPos = rect[nearSidePos] - scrollSpacing;
    } else {
      currPage.push(i);
    }
    return acc;
  }, []);
  return pages;
}

export function calculateActivePage({
  host,
  orientation,
  scrollBy,
}: {
  host: HTMLElement;
  orientation: "vertical" | "horizontal";
  scrollBy: "page" | "item";
}) {
  // We don't want to use this when scrollBy === 'item'
  // This edge case was from the original project, which didn't
  // support paginating by a single item when multiple are visible.
  // Doing this would short circuit and override the correct activePageIndex
  //
  // E.g., here's a multi item carousel:
  //
  // [ 15, 16, 17 ]
  //
  // This pathway would make the activePageIndex 17, when it should be 15
  if (scrollBy === "page") {
    // https://excalidraw.com/#json=1ztbZ26T3ri14SiJBZlt4,Rqa2mjiaYJesnfPYEiBdPQ
    const hasScrolledToEnd =
      Math.floor(host[scrollDimension] - host[scrollPos]) <=
      host[clientDimension];
    if (hasScrolledToEnd) {
      // If scrolled to the end, set page to last as it may not end up with an
      // offset of 0 due to scroll capping.
      // (it's not quite aligned with how snapping works, but good enough for now)
      return {
        pages: newPages,
        activePageIndex: newPages.length - 1,
      };
    }
  }

  const items = Array.from(host.children);
  const scrollPort = host.getBoundingClientRect();
  const offsets = newPages.map((page) => {
    const leadIndex = page[0];
    const leadEl = items[leadIndex];
    assert(leadEl instanceof HTMLElement, "Expected HTMLElement");
    const scrollSpacing = getEffectiveScrollSpacing(host, leadEl, nearSidePos);
    const rect = leadEl.getBoundingClientRect();
    const offset = rect[nearSidePos] - scrollPort[nearSidePos] - scrollSpacing;
    return Math.abs(offset);
  });
  const minOffset = Math.min(...offsets);
  const nextActivePageIndex = offsets.indexOf(minOffset);
}
