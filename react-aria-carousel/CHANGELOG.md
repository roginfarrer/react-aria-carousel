## 0.2.0

- `Carousel`, `CarouselButton`, `CarouselScroller`, `CarouselItem`, `CarouselTabs`, `CarouselTab`, `CarouselAutoplayControl` now forward the refs of their outer elements.
- `useCarousel` and `Carousel` now support a new prop `onActivePageIndexChange`. This prop accepts a function that's called with the new `activePageIndex` when it's changed. Fixes #1.

  ```jsx
  <Carousel
    onActivePageIndexChange={(args) => {
      setActivePageIndex(args.index);
    }}
  />
  ```

- Fixed a bug where having a number of items not divisible by `itemsPerPage` would not update the `activePageIndex` to the last page as expected. (e.g., if there are 8 items and the `itemsPerPage` option is set to `3`, the tabs would never reflect scrolling to the last page.) Fixes #2.
- Fixed a bug where mouse dragging was jittery and buggy between the first and last items when `mouseDragging` and `loop="infinite"` were set.
