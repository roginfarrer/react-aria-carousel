import { clamp, memo } from "./utils";

interface State {
  pages: number[][];
  activePageIndex: number;
}
/**
 * Options for useCarouselState
 */
export interface CarouselStateProps {
  /**
   * Number of items visible on a page. Can be an integer to
   * show each item with equal dimensions, or a floating point
   * number to "peek" subsequent items.
   * @default 1
   */
  itemsPerPage: number;
  /**
   * Controls the pagination behavior at the beginning and end.
   * "infinite" - will seamlessly loop to the other end of the carousel.
   * "native" - will scroll to the other end of the carousel.
   * false - will not advance beyond the first and last items.
   * @default false
   */
  loop?: "infinite" | "native" | false;
  /**
   * The carousel scroll direction.
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Controls whether scrolling snaps and pagination progresses by item or page.
   * @default 'page'
   */
  scrollBy?: "page" | "item";
  /**
   * Define the organization of pages on first render.
   * Useful to render navigation during SSR.
   * @default []
   */
  initialPages?: number[][];
  /** Whether the carousel should scroll when the user drags with their mouse */
  mouseDragging?: boolean;
  /**
   * Ref object that reflects whether the user is actively dragging
   * the carousel with their mouse
   */
  getIsDragging?: () => boolean;
  /**
   * Handler called when the activePageIndex changes
   */
  onStateChange?: ({
    activePageIndex,
    pages,
  }: {
    activePageIndex: number;
    pages: number[][];
  }) => void;
  getScrollElement: () => HTMLElement | null;
}

export class CarouselState {
  private options: Required<CarouselStateProps>;
  private pages: number[][];
  private activePageIndex: number = 0;

  private host: HTMLElement | null = null;
  private mutationObserver?: MutationObserver;
  private intersectionObserver?: IntersectionObserver;
  private scrollTimeout: any;
  private abortController: AbortController = new AbortController();

  constructor(options: CarouselStateProps) {
    this.options = options;
    this.pages = this.options.initialPages ?? [];
  }

  private setState = (
    updater: Partial<State> | ((state: State) => Partial<State>),
  ) => {
    const state =
      typeof updater === "function"
        ? updater({ pages: this.pages, activePageIndex: this.activePageIndex })
        : updater;
    this.pages = state.pages ?? this.pages;
    this.activePageIndex = state.activePageIndex ?? this.activePageIndex;
    this.options.onStateChange?.({
      pages: this.pages,
      activePageIndex: this.activePageIndex,
    });
  };

  private getItems = (
    { includeClones }: { includeClones?: boolean } = { includeClones: false },
  ): HTMLElement[] => {
    if (!this.host) return [];
    let allChildren = Array.from(this.host.children) as HTMLElement[];
    if (includeClones) return allChildren;
    return allChildren.filter((child) => !child.hasAttribute("data-clone"));
  };

  scrollToItem = (
    slide: HTMLElement,
    behavior: ScrollBehavior = "smooth",
  ): void => {
    if (!this.host) return;
    const scrollContainerRect = this.host.getBoundingClientRect();
    const nextSlideRect = slide.getBoundingClientRect();

    const nextLeft = nextSlideRect.left - scrollContainerRect.left;
    const nextTop = nextSlideRect.top - scrollContainerRect.top;

    this.host.scrollTo({
      left: nextLeft + this.host.scrollLeft,
      top: nextTop + this.host.scrollTop,
      behavior: prefersReducedMotion ? "instant" : behavior,
    });
  };

  scrollToPage = (index: number, behavior?: ScrollBehavior): void => {
    const items = this.getItems();
    const page = this.pages[index];
    const itemIndex = page?.[0];
    if (items[itemIndex]) {
      this.scrollToItem(items[itemIndex], behavior);
    }
  };

  private updateSnaps = memo(
    () => [this.host, this.pages.length, this.options.itemsPerPage],
    (_, __, itemsPerPage) => {
      const actualItemsPerPage = Math.floor(itemsPerPage);
      this.getItems({ includeClones: true }).forEach((item, index) => {
        const shouldSnap =
          this.options.scrollBy === "item" ||
          (index! + actualItemsPerPage) % actualItemsPerPage === 0;
        if (shouldSnap) {
          item.style.setProperty("scroll-snap-align", "start");
        } else {
          item.style.removeProperty("scroll-snap-align");
        }
      });
    },
    { key: "foo" },
  );

  private calculatePages = memo(
    () => [this.host, this.pages.length, this.options.itemsPerPage],
    (_, __, itemsPerPage): void => {
      const items = this.getItems();
      // We want to calculate the sets of pages based on the number
      // only 100% in view on a given page. If a number like 1.1 is provided,
      // the 10% we're peeking shouldn't count as an item on the page.
      const actualItemsPerPage = Math.floor(itemsPerPage);
      let newPages = items.reduce<number[][]>((acc, _, i) => {
        const currPage = acc.at(-1);
        if (currPage && currPage.length < actualItemsPerPage) {
          currPage.push(i);
        } else {
          acc.push([i]);
        }
        return acc;
      }, []);

      if (newPages.length >= 2) {
        let deficit = actualItemsPerPage - newPages.at(-1)!.length;
        if (deficit > 0) {
          const fill = [...newPages.at(-2)!].splice(
            actualItemsPerPage - deficit,
          );
          newPages.at(-1)!.unshift(...fill);
        }
      }
      this.setState((prev) => {
        const index = clamp(0, prev.activePageIndex, newPages.length - 1);
        return { activePageIndex: index, pages: newPages };
      });
    },
    { key: "what" },
  );

  public scrollToPageIndex = (index: number): number => {
    const pages = this.pages;
    const { loop, itemsPerPage } = this.options;
    const items = this.getItems();
    const itemsWithClones = this.getItems({ includeClones: true });
    const pagesWithClones = [pages.at(-1), ...pages, pages[0]];

    if (!items.length) return -1;

    let nextItem: HTMLElement, nextPageIndex: number, nextPage: number[];

    // @TODO: This should be rewritten for clarity and brevity
    if (loop === "infinite") {
      // The index allowing to be inclusive of cloned pages
      let nextIndex = clamp(-1, index, pagesWithClones.length);

      if (nextIndex < 0) {
        // First item in the prepended cloned page
        nextItem = itemsWithClones[0];
        nextPageIndex = pages.length - 1;
        nextPage = pages[nextPageIndex];
      } else if (nextIndex >= pages.length) {
        // First item in the appended cloned page
        nextItem = itemsWithClones.at(-1 * itemsPerPage) as HTMLElement;
        nextPageIndex = 0;
        nextPage = pages[0];
      } else {
        nextPageIndex = nextIndex;
        nextPage = pages[nextIndex];
        nextItem = items[nextPage[0]];
      }
    } else if (loop === "native") {
      nextPageIndex =
        index > pages.length - 1 ? 0 : index < 0 ? pages.length - 1 : index;
      nextPage = pages[nextPageIndex];
      let itemIndex = nextPage[0];
      nextItem = items[itemIndex];
    } else {
      nextPageIndex = clamp(0, index, pages.length - 1);
      nextPage = pages[nextPageIndex];
      let itemIndex = nextPage[0];
      nextItem = items[itemIndex];
    }

    this.scrollToItem(nextItem);
    return nextPageIndex;
  };

  public next = (): number => {
    return this.scrollToPageIndex(this.activePageIndex + 1);
  };

  public prev = (): number => {
    return this.scrollToPageIndex(this.activePageIndex - 1);
  };

  public sync = () => {
    const host = this.options.getScrollElement();

    if (this.host !== host) {
      this.destroy();
      this.host = host;
    }

    this.abortController = new AbortController();
    this.setupListeners();
    this.setupMutationObserver();
    this.calculatePages();
    this.updateClones();
    this.updateSnaps();
    this.scrollToPage(this.activePageIndex, "instant");
  };

  private updateClones = memo(
    () => [
      this.host,
      this.options.loop,
      this.pages.length,
      this.options.itemsPerPage,
    ],
    () => {
      if (!this.host) return;

      this.getItems({ includeClones: true }).forEach((item) => {
        if (item.hasAttribute("data-clone")) {
          item.remove();
        }
      });

      if (this.options.loop === "infinite") {
        const items = this.getItems();
        const firstPage = this.pages[0];
        // We're gonna modify this in a second with .reverse, so make sure not to mutate state
        const lastPage = [...this.pages.at(-1)!];

        if (firstPage === lastPage) return;

        lastPage.reverse().forEach((slide) => {
          const clone = items[slide].cloneNode(true) as HTMLElement;
          clone.setAttribute("data-clone", "true");
          clone.setAttribute("inert", "true");
          clone.setAttribute("aria-hidden", "true");
          this.host!.prepend(clone);
        });

        firstPage.forEach((slide) => {
          const clone = items[slide].cloneNode(true) as HTMLElement;
          clone.setAttribute("data-clone", "true");
          clone.setAttribute("inert", "true");
          clone.setAttribute("aria-hidden", "true");
          this.host!.append(clone);
        });
      }
    },
    { key: "bar" },
  );

  private setupMutationObserver = memo(
    () => [this.host],
    (host) => {
      if (!host) return;
      const mutationObserver = new MutationObserver((mutations) => {
        const childrenChanged = mutations.some((mutation) =>
          // @ts-expect-error This is fine
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            (el: HTMLElement) =>
              el.hasAttribute("data-carousel-item") &&
              !el.hasAttribute("data-clone"),
          ),
        );
        if (childrenChanged) {
          this.calculatePages();
          this.updateSnaps();
        }
      });

      mutationObserver.observe(host, { childList: true, subtree: true });
    },
    { key: "setupMutationObserver" },
  );

  private setupListeners = memo(
    () => [this.host, this.options.loop, this.options.mouseDragging],
    (host, loop, mouseDragging) => {
      if (!host) return;

      const hasIntersected = new Set<Element>();

      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !hasIntersected.has(entry.target)) {
              hasIntersected.add(entry.target);
            }
            if (!entry.isIntersecting) {
              hasIntersected.delete(entry.target);
            }
          }
        },
        {
          root: host,
          threshold: 0.6,
        },
      );
      const children = this.getItems({ includeClones: true });
      for (let child of children) {
        this.intersectionObserver.observe(child);
      }

      const handleScrollEnd = () => {
        if (hasIntersected.size === 0) return;
        const sorted = [...hasIntersected].sort((a, b) => {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1;
        });
        const firstIntersecting = sorted[0];

        if (
          loop === "infinite" &&
          firstIntersecting.hasAttribute("data-clone") &&
          !(mouseDragging && this.options.getIsDragging())
        ) {
          const cloneIndex =
            firstIntersecting.getAttribute("data-carousel-item");
          const actualItem = this.getItems().find(
            (el) => el.getAttribute("data-carousel-item") === cloneIndex,
          );
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.scrollToItem(actualItem!, "instant");
            });
          });
        } else {
          const indexString = (firstIntersecting as HTMLElement).dataset
            .carouselItem;

          if (process.env.NODE_ENV !== "production") {
            if (!indexString) {
              throw new Error(
                "Failed to find data-carousel-item HTML attribute on an item.",
              );
            }
          }

          const slideIndex = parseInt(indexString!, 10);
          this.setState((prev) => {
            const activePage = prev.pages.findIndex(
              (page) => page[0] === slideIndex,
            );
            const newIndex = clamp(0, activePage, this.getItems().length);
            return { activePageIndex: newIndex };
          });
        }
      };

      // Ideally we'd use the 'scrollend' event here.
      // However, some browsers will call the 'scrollend' handler *before*
      // snapping has settled. So in effect, the user will release the scroll,
      // then 'scrollend' event is called, and the element continues to scroll
      // to the closest snap position
      //
      // This will let us check whether scrolling has actually stopped and
      // whether the user is still dragging
      const handleScroll = () => {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          if (this.options.mouseDragging && this.options.getIsDragging?.())
            return;
          handleScrollEnd();
        }, 150);
      };

      host.addEventListener("scroll", handleScroll, {
        passive: true,
        signal: this.abortController.signal,
      });
    },
    { key: "someth" },
  );

  destroy = () => {
    clearTimeout(this.scrollTimeout);
    if (!this.host) return;
    this.abortController.abort();
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.host = null;
  };
}
