'use client';

import React, {forwardRef, useRef, UIEventHandler} from 'react';
import cx from 'classnames';
import Translation from '@wayfair/translation';
import {vars} from '@homebase/core';
import {SystemBox} from '@homebase/core/dist/Box';
import {assert} from '@homebase/core/dist/private/assert';
import {mapValues} from '@homebase/core/dist/private/mapValues';
import {useMergedRef} from '@homebase/core/dist/private/useMergedRef';
import type {TestIds} from '@private/types';
import {getSpaceVar, ItemContextProvider, useCarouselContext} from './utils';
import * as styles from '../Carousel.css';
import {
  getSystemProps,
  Height,
  Width,
  height,
  width,
} from '@homebase/core/dist/private/getSystemProps';
import {useDefaultProps} from '@private/useDefaultProps';

/**
 * @name Carousel.Scroller
 * @public
 * @system-props height, width
 */
export interface CarouselScrollerProps<Item> extends TestIds, Height, Width {
  /**
   * Handler called when the carousel scrolls.
   */
  onScroll?: UIEventHandler;
  /**
   * The <length> between each item in the carousel
   * @default '0px'
   */
  spaceBetweenItems?:
    | `$${Extract<keyof typeof vars.space, number>}`
    // TS hack to get autocompletion of vars.space to continue to work
    | (string & Record<never, never>);
  /**
   * The number of items visible on each page.
   * @default 1
   */
  visibleItems?:
    | number
    | Partial<Record<keyof typeof vars.breakpoints | 'all', number>>;
  /**
   * The items in the carousel.
   */
  children:
    | React.ReactElement
    | React.ReactElement[]
    | ((item: Item, index: number) => React.ReactElement);
}

const SYSTEM_PROPS = {...height, ...width};

const defaultProps = useDefaultProps.makeDefaults<
  CarouselScrollerProps<unknown>
>()({
  spaceBetweenItems: '0px',
  onScroll() {},
  visibleItems: 1,
});

const CarouselScroller = forwardRef(function CarouselScroller<Item>(
  props: CarouselScrollerProps<Item>,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const {
    spaceBetweenItems,
    onScroll,
    visibleItems,
    children,
    testIds,
    ...rest
    // Generics cause issues with the typing here
    // @ts-expect-error
  } = useDefaultProps('Carousel.Scroller', defaultProps, props);
  const context = useCarouselContext();

  assert(
    typeof spaceBetweenItems === 'string',
    `spaceBetweenItems must be a valid CSS <length-percentage> value. Received: ${JSON.stringify(
      spaceBetweenItems
    )}`,
    'Carousel'
  );

  const {
    orientation,
    isPolyfillScrolling,
    assignScrollerEl: contextScrollRef,
    isScrollbarDragging,
  } = context;
  const scrollRef = useRef<HTMLUListElement | null>(null);

  const scrollEl = useMergedRef(scrollRef, contextScrollRef, forwardedRef);

  const responsiveVisibleItems =
    typeof visibleItems === 'number' ? {all: visibleItems} : visibleItems;

  const gridSettings = {
    [orientation === 'horizontal'
      ? 'gridAutoColumns'
      : 'gridAutoRows']: mapValues(
      responsiveVisibleItems,
      (numberOfVisibleItems: number) =>
        `calc(100% / ${numberOfVisibleItems} - ${getSpaceVar(
          spaceBetweenItems
        )} * ${numberOfVisibleItems - 1} / ${numberOfVisibleItems})`
    ),
  };

  const content = (() => {
    if (typeof children === 'function') {
      assert(
        !!context.items,
        'Carousel.Scroller children is a function, but Carousel `items` prop is missing.',
        'Carousel'
      );
      return context.items.map((item, index) => {
        const child = children(item, index);
        return (
          <ItemContextProvider value={item} key={context.getItemKey(item)}>
            {child}
          </ItemContextProvider>
        );
      });
    } else {
      return React.Children.map(children, (child) => {
        // map over each item to pluck off the key
        return (
          <ItemContextProvider value={{key: child.key}}>
            {child}
          </ItemContextProvider>
        );
      });
    }
  })();

  const [systemProps] = getSystemProps(rest, SYSTEM_PROPS);

  return (
    <SystemBox
      {...systemProps}
      {...gridSettings}
      // Should announce when slides in view changes
      aria-live="polite"
      role="group"
      aria-label={Translation({
        msgid: 'carousel.scrollerLabel',
      })}
      onScroll={onScroll}
      testIds={testIds}
      gap={spaceBetweenItems}
      ref={scrollEl}
      className={cx(styles.scrollContainer, styles.orientation[orientation], {
        // Remove if polyfill scrolling, since it breaks the smooth scrolling animation
        // Mainly just occurs in Safari Technology Preview 15
        [styles.scrollSnapType[orientation]]:
          !isPolyfillScrolling && !isScrollbarDragging,
      })}
    >
      {content}
    </SystemBox>
  );
});

const _CarouselScroller = CarouselScroller as <Item>(
  props: CarouselScrollerProps<Item> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => React.ReactElement;

export {_CarouselScroller as CarouselScroller};
