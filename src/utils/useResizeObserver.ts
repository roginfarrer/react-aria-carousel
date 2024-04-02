import { useEffect, useMemo } from "react";

class RSObserver {
  #observer: ResizeObserver;
  #store: Map<Element, any> = new Map();

  constructor() {
    this.#init();
  }

  #init = () => {
    this.#observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (this.#store.has(entry.target)) {
          this.#store.get(entry.target)(entry);
        }
      }
    });
  };

  observe = (target: Element, cb: any) => {
    this.#store.set(target, cb);
    this.#observer.observe(target);
  };

  unobserve = (target: Element) => {
    this.#observer.unobserve(target);
    this.#store.delete(target);
  };

  disconnect = () => {
    this.#observer.disconnect();
    this.#init();
  };
}

export function useResizeObserver(
  target: Element,
  callback: (entry: ResizeObserverEntry) => void,
) {
  const observer = useMemo(
    () => (typeof window !== "undefined" ? new RSObserver() : null),
    [],
  );

  useEffect(() => {
    observer.observe(target, callback);
    return () => {
      observer.unobserve(target);
    };
  }, [target, callback]);
}
