# Carousel Navigation (Tab) Components

**Status:** Accepted <!-- Accepted, Deprecated, Superseded -->

## Context

Carousels can have a navigation section for jumping to a specific slide/item. There are specific attributes required for a11y to make this work, regardless of their presentation. PDP uses a thumbnail slider of product images to jump to, as an example.

## Decision

We created headless UI components for carousel navigation. They can be composed with the Carousel component, but are not required. We want to support a variety of presentations of the navigation (such as markers/dots or thumbnails), so the components can be provided different UI components. They also support all system props in order to support different orientations and presentations.

## Consequences

Users will need to put in the work to actually create the UI for carousel navigation. But this will support complex use cases like PDP's, or more simple use cases like markers.

We have the flexibility to create out-of-the-box carousel navigation components with these components in the future.

## Resources

- [W3 guidelines/example](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/)
- [Google A11y Video + Demo](https://www.youtube.com/watch?v=CXJv6zM003M)
