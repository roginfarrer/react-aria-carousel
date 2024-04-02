export function createScrollStopListener(
  target: Window | Document | Element,
  callback: () => void,
) {
  if ("onscrollend" in window) {
    target.addEventListener("scrollend", callback);
    return () => {
      target.removeEventListener("scrollend", callback);
    };
  }

  let isScrolling: number;
  function listener() {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      callback();
    }, 150);
  }
  window.addEventListener("scroll", listener, false);

  return () => {
    window.removeEventListener("scroll", listener, false);
  };
}
