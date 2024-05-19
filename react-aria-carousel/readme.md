# 🎠 React Aria Carousel

> The carousel for the modern age.

**React Aria Carousel** is a collection of React hooks and components that provide the behavior and accessibility implementation for building a carousel. Unlike many other carousels, this implementation uses the latest browser and DOM APIs for scrolling and snapping.

Checkout documentation and examples at https://react-aria-carousel.vercel.app.

## Features

- Native **browser scroll-snapping and smooth-scrolling** for performant transitions across pointer types.
- **Comprehensive behavior and accessibility coverage** for all elements of a carousel, including pagination, infinite scrolling, autoplay, and more.
- Support for showing **one or many items per page**, implemented with responsive-design.
- Support for **vertical and horizontal** scrolling.
- Support for **infinite scrolling**.
- Support for **autoplay** with affordances for disabling it.
- Support for **mouse dragging**.
- Written in **TypeScript**.

## Installation

```sh
npm install react-aria-carousel
```

## Usage

`react-aria-carousel` comes with both ready-to-go unstyled React components and hooks if you need more control over how the component is rendered.

A simple set-up using the components:

<!-- prettier-ignore -->
```tsx
import {
  Carousel,
  CarouselButton,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "react-aria-carousel";

<Carousel>
  <CarouselAutoplayControl />
  <CarouselButton dir="prev" />
  <CarouselButton dir="next" />
  <CarouselScroller>
    <CarouselItem />
  </CarouselScroller>
  <CarouselTabs>
    {(page) => (
      <CarouselTab index={page.index} />
    )}
  </CarouselTabs>
</Carousel>
```

And a simple set-up using the hooks:

```tsx
import {
  useCarousel,
  useCarouselItem,
  useCarouselTab,
} from "react-aria-carousel";

export function Carousel() {
  const [assignScrollerRef, carousel] = useCarousel({
    spaceBetweenItems: "16px",
    itemsPerPage: 2,
  });

  const {
    rootProps,
    prevButtonProps,
    nextButtonProps,
    scrollerProps,
    tabProps,
    pages,
    autoplayControlProps,
  } = carousel;

  return (
    <div {...rootProps}>
      <button {...autoplayControlProps}>Toggle autoplay</button>
      <div>
        <button {...prevButtonProps}>Previous</button>
        <button {...nextButtonProps}>Next</button>
      </div>
      <div {...scrollerProps} ref={assignScrollerRef}>
        <CarouselItem index={0} state={carousel} />
      </div>
      <div {...tabProps}>
        {pages.map((_, i) => (
          <CarouselTab key={i} index={i} state={carousel} />
        ))}
      </div>
    </div>
  );
}

function CarouselItem({ index, state }) {
  const { itemProps } = useCarouselItem({ index }, state);
  return <div {...itemProps} />;
}

function CarouselTab({ index, state }) {
  const { tabProps } = useCarouselTab({ index }, state);
  return <div {...tabProps} />;
}
```
