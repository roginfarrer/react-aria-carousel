# Title

**Status:** Accepted <!-- Accepted, Deprecated, Superseded -->

## Context

JSDOM doesn't support scroll methods, resulting in Jest errors when users test the component, ex:
`TypeError: slidesElement.scrollBy is not a function`.

## Decision

**Homebase will not implement a fix.**

Because this is a limitation of JSDOM that has a Jest solution, Homebase will not implement a fix. Instead, test writers can mock scrolling functions in their test suite. Ex:

```js
Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
  get() {
    return jest.fn();
  },
});
```

## Consequences

Homebase won't have to account for cases in which the carousel is used in JSDOM.

## Resources

- [Slack conversation](https://wayfair.slack.com/archives/CH6FPBGRX/p1701792024083019?thread_ts=1701792024.083019&cid=CH6FPBGRX) between bug reporter and Rogin
- [Methods not defined in JSDOM](https://wayfair.slack.com/archives/CH6FPBGRX/p1701792024083019?thread_ts=1701792024.083019&cid=CH6FPBGRX)
