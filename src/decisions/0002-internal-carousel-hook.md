# Internal Carousel Hook

**Status:** Accepted

## Context

The statefulness of the Carousel scroll position is a unique challenge. Unlike other forms of data, this value is one whose mode of manipulation is intrinsically opinionated. For example, the way the carousel scrolls is as important as to what position it's being scrolled too. The position also isn't immediately updated--there's an animation with a duration. We then have the challenge of needing to sort out what the API would be for consumers (what's an active index, and what happens if that number is programmatically updated) and how to provide shorthands to provide common scroll manipulations (scroll to a specific index, "jump" to an index without scrolling, go to the next/prev page, only scroll if the index is not in view, etc).

Previously, we opted to keep the `useCarousel`, the stateful hook, separate from the UI component, `Carousel`. Users would need to create the carousel state, and pass it to the component:

```typescript
function MyCarousel() {
  const carousel = useCarousel();

  function nextPage() {
    carousel.scrollToNextPage();
  }

  return (
    <Carousel carousel={carousel}>
      <Carousel.Scroller />
      <Carousel.Nav />
    </Carousel>
  );
}
```

This would let users get access to the stateful values, such as `scrollPosition` and `activePageIndex`, without needing to control that state themselves.

The downside of the API is that this is an unusual API for a component, unlike anything else we have in the library. We also confuse where to pass values into control the Carousel behavior. Do I pass props into the `useCarousel` hook or into the `Carousel` component?

## Decision

We decided to move the `useCarousel` hook into the `Carousel` component, and use change callbacks and refs to expose functionality. Example:

```typescript
function MyCarousel() {
  const carouselRef = useRef<CarouselRef>();
  const [activePageIndex, setActivePageIndex] = useState(0);

  function nextPage() {
    carouselRef.current?.scrollToNextPage();
  }

  return (
    <Carousel ref={carouselRef} onActivePageIndexChange={setActivePageIndex}>
      <Carousel.Scroller />
      <Carousel.Nav />
    </Carousel>
  );
}
```

## Consequences

- Users will need to import the `CarouselRef` type to properly type their ref.
- Users will need to create state and pass state setters to the Carousel component to get an accurate read of the component state. The values still cannot be controlled directly.
- We clarify the API for the Carousel, where all values and functionality come from the component (in lieu of an additional hook).
