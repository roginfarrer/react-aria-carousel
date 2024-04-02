export function assert(value: any, message: string): asserts value {
  if (value) {
    return;
  }
  throw new RSCError(message);
}

class RSCError extends Error {
  constructor(message: string) {
    super(`[react-snap-carousel]: ${message}`);
  }
}

// Like `el.getBoundingClientRect()` but ignores scroll.
// It's similar to `offsetLeft` / `offsetTop`, but offers some of the virtues of `getBoundingClientRect`
// such as factoring in CSS transforms & handling wrapped inline elements.
// https://codepen.io/riscarrott/pen/ZEjyyay
// https://w3c.github.io/csswg-drafts/cssom-view/#dom-htmlelement-offsetleft
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft
export const getOffsetRect = (el: Element, relativeTo?: Element | null) => {
  const rect = _getOffsetRect(el);
  if (!relativeTo) {
    return rect;
  }
  const relativeRect = _getOffsetRect(relativeTo);
  return {
    left: rect.left - relativeRect.left,
    top: rect.top - relativeRect.top,
    right: rect.right - relativeRect.left,
    bottom: rect.bottom - relativeRect.top,
    width: rect.width,
    height: rect.height,
  };
};

const _getOffsetRect = (el: Element) => {
  const rect = el.getBoundingClientRect();
  let scrollLeft = 0;
  let scrollTop = 0;
  let parentEl = el.parentElement;
  while (parentEl) {
    scrollLeft += parentEl.scrollLeft;
    scrollTop += parentEl.scrollTop;
    parentEl = parentEl.parentElement;
  }
  const left = rect.left + scrollLeft;
  const top = rect.top + scrollTop;
  return {
    left,
    top,
    right: left + rect.width,
    bottom: top + rect.height,
    width: rect.width,
    height: rect.height,
  };
};

//  `window.getComputedStyle` gives us the *computed* value for scroll-padding-* so we have
// to convert it to the used value (i.e. px value) ourselves :(
// https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding
export const getScrollPaddingUsedValue = (
  el: HTMLElement,
  pos: "left" | "top",
) => {
  const style = window.getComputedStyle(el);
  const scrollPadding = style.getPropertyValue(`scroll-padding-${pos}`);
  if (
    scrollPadding === "auto" ||
    // Value in jest
    scrollPadding === ""
  ) {
    return 0;
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/length
  // https://www.w3.org/TR/css3-values/#length-value
  const invalidMsg = `Unsupported scroll padding value, expected <length> or <percentage> value, received ${scrollPadding}`;
  if (scrollPadding.endsWith("px")) {
    const value = parseInt(scrollPadding, 10);
    assert(!Number.isNaN(value), invalidMsg);
    return value;
  }
  if (scrollPadding.endsWith("%")) {
    const value = parseInt(scrollPadding, 10);
    assert(!Number.isNaN(value), invalidMsg);
    return (el.clientWidth / 100) * value;
  }
  // e.g. calc(10% + 10px) // NOTE: We could in theory resolve this...
  assert(false, invalidMsg);
};

// Unlike scroll-padding, scroll-margin doesn't support <percentage> values, so we should always
// get back a px value, meaning it's effectively already the *used* value.
// https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin
export const getScrollMarginUsedValue = (
  el: HTMLElement,
  pos: "left" | "top",
) => {
  const style = window.getComputedStyle(el);
  const scrollMargin = style.getPropertyValue(`scroll-margin-${pos}`);
  if (scrollMargin === "") {
    // For jest
    return 0;
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/length
  // https://www.w3.org/TR/css3-values/#length-value
  const invalidMsg = `Unsupported scroll margin value, expected <length> value, received ${scrollMargin}`;
  assert(scrollMargin.endsWith("px"), invalidMsg); // Even scroll-margin: 0 should return "0px"
  const value = parseInt(scrollMargin, 10);
  assert(!Number.isNaN(value), invalidMsg);
  return value;
};

// The 'effective' scroll spacing is the actual scroll padding + margin that will be used for a
// given item after factoring in whether there is enough scroll width available.
export const getEffectiveScrollSpacing = (
  scrollEl: HTMLElement,
  itemEl: HTMLElement,
  pos: "left" | "top",
) => {
  const scrollPadding = getScrollPaddingUsedValue(scrollEl, pos);
  const scrollMargin = getScrollMarginUsedValue(itemEl, pos);
  const rect = getOffsetRect(itemEl, itemEl.parentElement);
  return Math.min(scrollPadding + scrollMargin, rect[pos]);
};
