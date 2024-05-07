import { useEffect } from "react";

export function useAriaBusyScroll(host?: HTMLElement | null) {
  useEffect(() => {
    if (!host) return;
    function onscroll() {
      if (!host) return;
      host.setAttribute("aria-busy", "true");
      host.addEventListener("scrollend", onscrollend, { once: true });
    }
    function onscrollend() {
      if (!host) return;
      host.setAttribute("aria-busy", "false");
      host.addEventListener("scroll", onscroll, { once: true });
    }
    host.addEventListener("scroll", onscroll, { once: true });
    host.addEventListener("scrollend", onscrollend);
    return () => {
      host.removeEventListener("scroll", onscroll);
      host.removeEventListener("scrollend", onscrollend);
    };
  }, [host]);
}
