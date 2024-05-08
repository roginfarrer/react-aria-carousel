export function noop() {}
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
export function getNavItems(host: HTMLElement) {
  return host.querySelectorAll(
    "[data-carousel-nav-item]",
  ) as NodeListOf<HTMLElement>;
}
export function getNavItem(host: HTMLElement, index: number) {
  return host.querySelector(
    `[data-carousel-nav-item="${index}"]`,
  ) as HTMLElement;
}

export function genItemId(id: string, idx: number) {
  return `${id}-${idx}`;
}

export function clamp(min: number, value: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
