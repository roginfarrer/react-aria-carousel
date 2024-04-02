# Collections API

**Status:** Accepted

## Context

The Carousel component shares the common UI pattern of a parent component needing access to the data and order of its children. (Frequently referred to as descendants or collections.) To this point, the Carousel logic only needed access to the children during specific events, so we used DOM queries in order to extract that information. For example, `Array.from(scrollElement.children)`. This implementation is a bit naive because its circumvents the typical react model of refs, and relies on each child actually being an element we want to count, and that there are no nested elements that we want to include.

This API also doesn't draw an explicit relationship between the items and the Carousel itself, which can create some holes in the API that would implicitly support some suboptimal implementations. (Like using the Carousel without Carousel.Item, and using another component.)

This API also doesn't solve for each item in the carousel or each navigation item being able to know its placement in the order. This results in having to map over the same data twice:

```typescript
const slides = {
  [{id: 1, src: 'url'}],
  [{id: 2, src: 'url'}],
  [{id: 3, src: 'url'}],
};

function MyCarousel() {
  return (
    <Carousel>
      <Carousel.Scroller>
        {slides.map((slide, index) => (
          <Carousel.Item index={index} key={slide.id}>
            <img src={slide.src} />
          </Carousel.Item>
        ))}
      </Carousel.Scroller>
      <Carousel.Nav>
        {slides.map((slide, index) => (
          <Carousel.NavItem index={index} key={slide.id}>
            {activeIndex === index ? '🔴' : '🔵'}
          </Carousel.NavItem>
        ))}
      </Carousel.Nav>
    </Carousel>
  )
}
```

While there's nothing wrong with this API, there's some boilerplate required by the user to make this component work, namely mapping over data and providing the index of each item. In the case that the navigation tabs are used, there's no explicit connection between the slides and the nav items. (Users need to make sure that the same set of data is used for each map.)

## Decision

We added a collections API inspired by [React Spectrum](https://react-spectrum.adobe.com/react-stately/collections.html) that builds off of the Descendants API from [Chakra](https://github.com/chakra-ui/chakra-ui/tree/f5b1a3569fd0c654897d2397b3d0bd4677783fa7/packages/components/descendant).

The above example can be rewritten with this API as so:

```typescript
const slides = {
  [{id: 1, src: 'url'}],
  [{id: 2, src: 'url'}],
  [{id: 3, src: 'url'}],
};
type Slide = typeof slides[number];

function MyCarousel() {
  return (
    <Carousel items={slides}>
      <Carousel.Scroller>
        {(slide: Slide) => (
          <Carousel.Item>
            <img src={slide.src} />
          </Carousel.Item>
         ))}
      </Carousel.Scroller>
      <Carousel.Nav>
        {(_, index) => (
          <Carousel.NavItem>
            {activeIndex === index ? '🔴' : '🔵'}
          </Carousel.NavItem>
         ))}
      </Carousel.Nav>
    </Carousel>
  )
}
```

Users can still map over their data if they'd like, or provide slides as children:

```typescript
function MyCarousel() {
  return (
    <Carousel>
      <Carousel.Scroller>
        <Carousel.Item key="a">
          <img src="url" />
        </Carousel.Item>
        <Carousel.Item key="b">
          <img src="url" />
        </Carousel.Item>
        <Carousel.Item key="c">
          <img src="url" />
        </Carousel.Item>
      </Carousel.Scroller>
      <Carousel.Nav>
        {(_, index) => (
          <Carousel.NavItem>
            {activeIndex === index ? '🔴' : '🔵'}
          </Carousel.NavItem>
         ))}
      </Carousel.Nav>
    </Carousel>
  )
}
```

Regardless of how users render the slides, the descendants API from Chakra will create an instance of a collection that can be used with the carousel to manage the items.

## Consequences

**Pros**

- When users assemble a Carousel pattern, less boilerplate is required to set it up.
- Afford more flexibility in different ways of rendering the component, and optimize for cases with dynamic data
- Clarifies the relationship between the slides and the navigation items

**Cons**

Requires more complexity within the component to perform the data mapping, tracking the descendants, etc. We use React context in more places to communicate data between parent components and their items (such as index). But the ease afforded to the user should be worth it.
