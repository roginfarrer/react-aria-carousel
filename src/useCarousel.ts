/**
 * Copyright (c) 2023 Richard Scarrott
 *
 * https://github.com/richardscarrott/react-snap-carousel
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  KeyboardEventHandler,
  useRef,
} from 'react';
import Translation from '@wayfair/translation';

import {smoothScroll} from '@homebase/core/dist/private/smoothScroll';
import {useMedia} from '@homebase/core';
import {useId} from '@homebase/core/dist/private/useId';
import {announce} from '@homebase/core/dist/LiveAnnouncer';

import {createScrollStopListener} from '@private/createScrollStopListener';
import {useIsomorphicLayoutEffect} from '@private/useIsomorphicLayoutEffect';
import {useResizeObserver} from '@private/useResizeObserver';
import {useCallbackRef} from '@private/useCallbackRef';

import {
  assert,
  getEffectiveScrollSpacing,
  getOffsetRect,
} from './internal/dimensions';
import {
  canSmoothScroll,
  flatten,
  getPolyfillScrollDuration,
  useCarouselElementRefs,
  useCarouselNavDescendantsInit,
  useDescendantsInit,
} from './internal/utils';

interface ScrollOpts {
  /**
   * If false, will jump to the provided page without scrolling animation
   * @default true
   */
  animate?: boolean;
}

type CarouselPaginate = (opts?: ScrollOpts & {loop?: boolean}) => number;

/**
 * @public
 * @name useCarousel
 */
export interface UseCarouselResult {
  /** The page in view */
  readonly activePageIndex: number;
  /**
   * The items of the carousel, by index, that the carousel should snap to.
   * Changes based on the number of slides in view.
   */
  readonly snapPointIndexes: Set<number>;
  /** An array representation of each snappable segment of the carousel. */
  readonly pages: number[][];
  /** Scroll to the previous page */
  readonly scrollToPreviousPage: CarouselPaginate;
  /** Scroll to the next page */
  readonly scrollToNextPage: CarouselPaginate;
  /** Scroll to the provided page by index */
  readonly scrollTo: (pageIndex: number, options?: ScrollOpts) => void;
  /** Manually trigger the carousel to recalculate the pages and activePageIndex */
  readonly refresh: () => void;
  /** Assigns the root scrolling element */
  readonly assignScrollerEl: (el: HTMLElement | null) => void;
  /** The root scrolling element */
  readonly scrollerEl: HTMLElement | null;
  /** If true, the carousel smooth-scrolling using a JS polyfill */
  readonly isPolyfillScrolling: boolean;
  /**
   * Scroll to the provided page, by index, until it's in view.
   * Will not scroll if the page is already in view.
   */
  readonly scrollIntoView: (pageIndex: number, opts?: ScrollOpts) => void;
  /** A coarse representation of the scroll position */
  readonly scrollPosition: 'start' | 'end' | 'middle';
  /** Horizontal or vertical carousel */
  readonly orientation: 'vertical' | 'horizontal';
  /** Function that returns props for a Carousel's navigation item */
  readonly getNavItemProps: (props: {
    index: number;
  }) => {
    type: 'button';
    role: 'tab';
    'aria-controls': string;
    'aria-labelledby': string;
    'aria-posinset': number;
    'aria-setsize': number;
    'aria-selected': boolean;
    tabIndex: 0 | -1;
    onClick: () => void;
  };
  /** Function that returns props for a Carousel's navigation */
  readonly getNavProps: () => {
    role: 'tablist';
  };
  /** Function that returns props for a Carousel Item */
  readonly getItemProps: (props: {
    index: number;
  }) => {
    id: string;
    role: 'group';
    'aria-label': string;
    'aria-roledescription': string;
  };
  /** Ref assignment handlers */
  readonly refs: ReturnType<typeof useCarouselElementRefs>[1];
  /** Function to be called on the onKeyDown event on the root carousel element */
  readonly handleRootElKeydown: KeyboardEventHandler<HTMLElement>;
  /** Descendant manager for the carousel items */
  readonly itemDescendantsManager: ReturnType<typeof useDescendantsInit>;
  /** Descendant manager for the navigation items */
  readonly navItemDescendantsManager: ReturnType<
    typeof useCarouselNavDescendantsInit
  >;
}

export interface UseCarouselOptions {
  /**
   * The direction of the carousel
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Describes the initial pagination of the carousel, useful for SSR k
   * @default []
   */
  initialPages?: number[][];
  /**
   * Handler called when the activePageIndex changes
   */
  onActivePageIndexChange?: (idx: number) => void;
  /**
   * If 'page', the carousel will scroll by the number of items in view.
   * If 'item', the carousel will scroll by each individual item.
   * @default 'page'
   */
  scrollBy?: 'page' | 'item';
  /** Handler called when the scroll position changes */
  onScrollPositionChange?: (pos: 'start' | 'middle' | 'end') => void;
  /** @default false */
  enableLoopPagination?: boolean;
}

export const useCarousel = (
  options: UseCarouselOptions = {}
): UseCarouselResult => {
  const {
    orientation = 'horizontal',
    initialPages = [],
    onActivePageIndexChange = () => {},
    scrollBy = 'page',
    onScrollPositionChange,
    enableLoopPagination = false,
  } = options;

  const itemDescendantsManager = useDescendantsInit();
  const navItemDescendantsManager = useCarouselNavDescendantsInit();

  const uniqueId = useId();
  const prefersReducedMotion = useMedia({
    mediaQuery: '(prefers-reduced-motion: reduce)',
  });
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  const dimension = orientation === 'horizontal' ? 'width' : 'height';
  const scrollDimension =
    orientation === 'horizontal' ? 'scrollWidth' : 'scrollHeight';
  const clientDimension =
    orientation === 'horizontal' ? 'clientWidth' : 'clientHeight';
  const nearSidePos = orientation === 'horizontal' ? 'left' : 'top';
  const farSidePos = orientation === 'horizontal' ? 'right' : 'bottom';
  const scrollPos = orientation === 'horizontal' ? 'scrollLeft' : 'scrollTop';

  // Safari doesn't currently support scroll with smooth scrolling
  // Another fun bug in Safari tech preview is that when the scroll-snap-type
  // is set, it also breaks our polyfill. So we use this flag to toggle
  // that property while we polyfill smooth scroll
  const [isPolyfillScrolling, setIsPolyfillScrolling] = useState(false);

  const [scrollPosition, setScrollPosition] = useState<
    'start' | 'middle' | 'end'
  >('start');

  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const [carouselRefs, setCarouselRefs] = useCarouselElementRefs();

  // NOTE: `pages` & `activePageIndex` are modelled as a single state object
  // to ensure they don't become out of sync with one another. (i.e. would rather
  // not implicitly rely on set state batching)
  const [state, bareSetCarouselState] = useState<{
    pages: number[][];
    activePageIndex: number;
  }>({
    pages: initialPages,
    activePageIndex: 0,
  });

  const {pages, activePageIndex} = state;

  // Because we're announcing the change on scroll, we need to dedupe the message
  // so we're not blasting the queue of announcements on every pixel shift
  const lastAnnounced = useRef<{index: number; length: number}>({
    index: activePageIndex,
    length: pages.length,
  });

  const onPageChange = useCallbackRef(onActivePageIndexChange);

  const setCarouselState = useCallback(
    (args: typeof state) => {
      if (
        lastAnnounced.current.index !== args.activePageIndex ||
        lastAnnounced.current.length !== args.pages.length
      ) {
        const inView = args.pages[args.activePageIndex];
        if (!inView) return;
        const firstItem = inView[0];
        const lastItem = inView[inView.length - 1];
        if (firstItem === lastItem) {
          announce(
            Translation({
              msgid: 'carousel.singleItemAnnouncement',
              params: {
                currentItem: args.activePageIndex + 1,
                totalLength: args.pages.length,
              },
            }),
            'polite'
          );
        } else {
          announce(
            Translation({
              msgid: 'carousel.multiItemAnnouncement',
              params: {
                firstIndex: firstItem + 1,
                itemsPerPage: lastItem + 1,
                totalLength: flatten(args.pages).length,
              },
            }),
            'polite'
          );
        }
        lastAnnounced.current = {
          index: args.activePageIndex,
          length: args.pages.length,
        };
      }
      bareSetCarouselState(args);
      onPageChange?.(args.activePageIndex);
    },
    [onPageChange]
  );

  const refreshActivePage = useCallback(
    (newPages: number[][]) => {
      if (!scrollEl) return;

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
      if (scrollBy === 'page') {
        // https://excalidraw.com/#json=1ztbZ26T3ri14SiJBZlt4,Rqa2mjiaYJesnfPYEiBdPQ
        const hasScrolledToEnd =
          Math.floor(scrollEl[scrollDimension] - scrollEl[scrollPos]) <=
          scrollEl[clientDimension];
        if (hasScrolledToEnd) {
          // If scrolled to the end, set page to last as it may not end up with an
          // offset of 0 due to scroll capping.
          // (it's not quite aligned with how snapping works, but good enough for now)
          setCarouselState({
            pages: newPages,
            activePageIndex: newPages.length - 1,
          });
          return;
        }
      }

      const items = itemDescendantsManager.values();
      const scrollPort = scrollEl.getBoundingClientRect();
      const offsets = newPages.map((page) => {
        const leadIndex = page[0];
        const leadEl = items[leadIndex].node;
        assert(leadEl instanceof HTMLElement, 'Expected HTMLElement');
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          leadEl,
          nearSidePos
        );
        const rect = leadEl.getBoundingClientRect();
        const offset =
          rect[nearSidePos] - scrollPort[nearSidePos] - scrollSpacing;
        return Math.abs(offset);
      });
      const minOffset = Math.min(...offsets);
      const nextActivePageIndex = offsets.indexOf(minOffset);
      setCarouselState({pages: newPages, activePageIndex: nextActivePageIndex});

      // before we possibly disable a button
      // shift the focus to the other button
      if (
        !enableLoopPagination &&
        nextActivePageIndex === 0 &&
        document.activeElement === carouselRefs.prevButton.current
      ) {
        carouselRefs.nextButton.current?.focus();
      }
      if (
        !enableLoopPagination &&
        nextActivePageIndex === newPages.length - 1 &&
        document.activeElement === carouselRefs.nextButton.current
      ) {
        carouselRefs.prevButton.current?.focus();
      }
    },
    [
      carouselRefs,
      enableLoopPagination,
      scrollEl,
      scrollBy,
      setCarouselState,
      scrollDimension,
      scrollPos,
      clientDimension,
      nearSidePos,
      itemDescendantsManager,
    ]
  );

  const refresh = useCallback(() => {
    if (!scrollEl) return;

    const items = itemDescendantsManager.values();
    const scrollPort = scrollEl.getBoundingClientRect();
    let currPageStartPos: number;
    const pages = items.reduce<number[][]>((acc, item, i) => {
      const node = item.node;
      const currPage = acc[acc.length - 1];
      const rect = getOffsetRect(node, node.parentElement);
      if (
        !currPage ||
        rect[farSidePos] - currPageStartPos > Math.ceil(scrollPort[dimension])
      ) {
        acc.push([i]);
        const scrollSpacing = getEffectiveScrollSpacing(
          scrollEl,
          node,
          nearSidePos
        );
        currPageStartPos = rect[nearSidePos] - scrollSpacing;
      } else {
        currPage.push(i);
      }
      return acc;
    }, []);
    refreshActivePage(pages);
  }, [
    scrollEl,
    itemDescendantsManager,
    refreshActivePage,
    farSidePos,
    dimension,
    nearSidePos,
  ]);

  useIsomorphicLayoutEffect(() => {
    refresh();
  }, [refresh]);

  useResizeObserver({handleEntry: refresh, element: scrollEl});

  useEffect(() => {
    if (!scrollEl) return;

    function handler(e: Event) {
      refreshActivePage(pages);

      if (!e.target) return;

      if (e.target[scrollPos] === 0) {
        setScrollPosition('start');
        onScrollPositionChange?.('start');
      } else if (
        e.target[scrollPos] + e.target[clientDimension] ===
        e.target[scrollDimension]
      ) {
        setScrollPosition('end');
        onScrollPositionChange?.('end');
      } else {
        setScrollPosition('middle');
        onScrollPositionChange?.('middle');
      }
    }
    scrollEl.addEventListener('scroll', handler, {passive: true});
    return () => {
      scrollEl.removeEventListener('scroll', handler);
    };
  }, [
    clientDimension,
    onScrollPositionChange,
    pages,
    refreshActivePage,
    scrollDimension,
    scrollEl,
    scrollPos,
  ]);

  useEffect(() => {
    if (canSmoothScroll || !scrollEl) return;
    const destroyListener = createScrollStopListener(scrollEl, () => {
      setIsPolyfillScrolling(false);
    });
    return destroyListener;
  }, [scrollEl]);

  /**
   * Wrapper around the Element.scrollTo method to fallback to a
   * polyfilled smooth-scroll if the browser doesn't support smooth scrollTo
   * ಠ_ಠ Safari
   */
  const scroll = useCallback(
    (nearSideEdge: number, opts: ScrollOpts) => {
      if (!scrollEl) return;

      const {animate = true} = opts;
      if (!animate) {
        scrollEl[scrollPos] = nearSideEdge;
        return;
      }

      if (canSmoothScroll) {
        scrollEl.scrollTo({
          behavior: scrollBehavior,
          [nearSidePos]: nearSideEdge,
        });
      } else {
        setIsPolyfillScrolling(true);

        if (prefersReducedMotion) {
          // Just set the scroll position and bail early
          scrollEl[scrollPos] = nearSideEdge;
          return;
        }

        const distance =
          scrollEl[scrollPos] > nearSideEdge
            ? scrollEl[scrollPos] - nearSideEdge
            : nearSideEdge - scrollEl[scrollPos];

        smoothScroll({
          element: scrollEl,
          [nearSidePos === 'left' ? 'x' : 'y']: nearSideEdge,
          duration: getPolyfillScrollDuration(distance),
        });
      }
    },
    [nearSidePos, prefersReducedMotion, scrollBehavior, scrollEl, scrollPos]
  );

  const scrollTo = useCallback(
    (index: number, opts: {animate?: boolean} = {}) => {
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const items = itemDescendantsManager.values();
      const leadIndex: number | undefined = page[0];
      const leadEl = items[leadIndex].node;
      if (!(leadEl instanceof HTMLElement)) return;

      const scrollSpacing = getEffectiveScrollSpacing(
        scrollEl,
        leadEl,
        nearSidePos
      );

      const nearSideEdge =
        getOffsetRect(leadEl, leadEl.parentElement)[nearSidePos] -
        scrollSpacing;

      scroll(nearSideEdge, opts);
    },
    [itemDescendantsManager, nearSidePos, pages, scroll, scrollEl]
  );

  const scrollIntoView = useCallback(
    (index: number, opts: ScrollOpts = {}) => {
      if (!scrollEl) return;

      const page = pages[index];
      if (!page) return;

      const items = itemDescendantsManager.values();
      const leadIndex: number | undefined = page[0];
      const leadEl = items[leadIndex].node;
      if (!(leadEl instanceof HTMLElement)) return;

      const startScrollSpacing = getEffectiveScrollSpacing(
        scrollEl,
        leadEl,
        nearSidePos
      );
      const rect = getOffsetRect(leadEl, leadEl.parentElement);
      const itemStartEdge = rect[nearSidePos] - startScrollSpacing;
      // TODO: not appropriately accounting for end scroll spacing here
      const itemEndEdge = rect[farSidePos];

      const currentScrollPosStart = scrollEl[scrollPos];
      const currentScrollPosEnd =
        currentScrollPosStart + scrollEl[clientDimension];

      if (
        // If item is in view, don't scroll
        itemStartEdge >= currentScrollPosStart &&
        itemEndEdge <= currentScrollPosEnd
      ) {
        return;
      }

      scroll(itemStartEdge, opts);
    },
    [
      clientDimension,
      farSidePos,
      itemDescendantsManager,
      nearSidePos,
      pages,
      scroll,
      scrollEl,
      scrollPos,
    ]
  );

  const scrollToPreviousPage: CarouselPaginate = (opts) => {
    const next = activePageIndex - 1;
    if ((opts?.loop ?? enableLoopPagination) && next < 0) {
      scrollTo(pages.length - 1);
      return pages.length - 1;
    }
    scrollTo(next, {animate: opts?.animate});
    return next;
  };

  const scrollToNextPage: CarouselPaginate = (opts) => {
    const next = activePageIndex + 1;
    if ((opts?.loop ?? enableLoopPagination) && next > pages.length - 1) {
      scrollTo(0);
      return 0;
    }
    scrollTo(next, {animate: opts?.animate});
    return next;
  };

  const handleRootKeyDown: KeyboardEventHandler = (e) => {
    function forward() {
      e.preventDefault();
      const nextIndex = scrollToNextPage();
      if (carouselRefs.nav.current?.contains(e.target as Node)) {
        navItemDescendantsManager.item(nextIndex)?.node.focus();
      } else if (!enableLoopPagination && nextIndex >= pages.length - 1) {
        carouselRefs.prevButton.current?.focus();
      } else {
        carouselRefs.nextButton.current?.focus();
      }
    }
    function backward() {
      e.preventDefault();
      const nextIndex = scrollToPreviousPage();
      if (carouselRefs.nav.current?.contains(e.target as Node)) {
        navItemDescendantsManager.item(nextIndex)?.node.focus();
      } else if (!enableLoopPagination && nextIndex <= 0) {
        carouselRefs.nextButton.current?.focus();
      } else {
        carouselRefs.prevButton.current?.focus();
      }
    }
    switch (e.key) {
      case 'ArrowUp': {
        if (orientation === 'vertical') {
          backward();
        }
        break;
      }
      case 'ArrowRight': {
        if (orientation === 'horizontal') {
          forward();
        }
        break;
      }
      case 'ArrowDown': {
        if (orientation === 'vertical') {
          forward();
        }
        break;
      }
      case 'ArrowLeft': {
        if (orientation === 'horizontal') {
          backward();
        }
        break;
      }
    }
  };

  const snapPointIndexes = useMemo(() => {
    if (scrollBy === 'item') {
      return new Set(flatten(pages));
    }
    return new Set(pages.map((page) => page[0]));
  }, [pages, scrollBy]);

  const getNavProps: UseCarouselResult['getNavProps'] = () => {
    return {
      role: 'tablist',
    };
  };

  const getItemProps: UseCarouselResult['getItemProps'] = ({index}) => {
    return {
      inert: pages[activePageIndex]?.includes(index) ? undefined : 'true',
      id: `carousel-${index + 1}-${uniqueId}`,
      role: 'group' as const,
      'aria-label': Translation({
        msgid: 'carousel.itemXofX',
        params: {
          currentItem: (index ?? 0) + 1,
          totalItems: flatten(pages).length ?? 1,
        },
      }),
      'aria-roledescription': Translation({
        msgid: 'carousel.itemRoleDescription',
      }),
    };
  };

  const getNavItemProps: UseCarouselResult['getNavItemProps'] = ({index}) => {
    const isSelected = activePageIndex === index;
    const itemId = `carousel-${index + 1}-${uniqueId}`;
    return {
      type: 'button',
      role: 'tab',
      'aria-controls': itemId,
      'aria-labelledby': itemId,
      'aria-posinset': index + 1,
      'aria-setsize': flatten(pages).length,
      'aria-selected': isSelected,
      tabIndex: isSelected ? 0 : -1,
      onClick: () => scrollIntoView(index),
    };
  };

  return {
    scrollIntoView,
    scrollToPreviousPage,
    scrollToNextPage,
    scrollTo,
    refresh,
    activePageIndex,
    snapPointIndexes,
    pages,
    assignScrollerEl: setScrollEl,
    scrollerEl: scrollEl,
    refs: setCarouselRefs,
    handleRootElKeydown: handleRootKeyDown,
    isPolyfillScrolling,
    scrollPosition,
    orientation,
    getNavProps,
    getNavItemProps,
    getItemProps,
    itemDescendantsManager,
    navItemDescendantsManager,
  };
};
