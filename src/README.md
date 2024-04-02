# Carousel

This component and hook is based off the [react-snap-carousel](https://github.com/richardscarrott/react-snap-carousel) library. We forked the library, instead of using it directly, for the following reasons:

- We need to use a polyfill for smooth scrolling on Safari.
- We added `scrollIntoView`.
- Added support for detecting `prefers-reduced-motion`.
- Refactored `orientationchange` and `resize` event listeners to a `ResizeObserver` on the scrolling element.
- API and naming that fits our standards a bit better.
