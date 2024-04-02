'use client';

import React, {
  Key,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import Translation from '@wayfair/translation';

import {TestIds} from '@private/types';

import {SystemBox} from '@homebase/core/dist/Box';
import {
  getSystemProps,
  common,
  Common,
  layout,
  Layout,
} from '@homebase/core/dist/private/getSystemProps';

import {
  useCarousel,
  UseCarouselOptions,
  UseCarouselResult,
} from './useCarousel';
import {CarouselItem} from './internal/CarouselItem';
import {CarouselScroller} from './internal/CarouselScroller';
import {
  CarouselNextButton,
  CarouselPreviousButton,
} from './internal/CarouselButtons';
import {
  CarouselContext,
  CarouselDescendantProvider,
  CarouselContextProvider,
  Item,
  CarouselNavDescendantProvider,
} from './internal/utils';
import {CarouselNav, CarouselNavItem} from './internal/CarouselNavigation';
import {CarouselScrollbar} from './internal/CarouselScrollbar';
import {useScrollbar} from '@root/private/useScrollbar';
import {useDefaultProps} from '@root/private/useDefaultProps';

/**
 * @public
 * @name Carousel
 * @system-props common, layout
 */
export interface CarouselProps<
  CarouselItem extends Item
> extends UseCarouselOptions,
    TestIds,
    Common,
    // The component should control overflow.
    Omit<Layout, 'overflow' | 'overflowX' | 'overflowY'>,
    Pick<CarouselContext<CarouselItem>, 'snapAnchor' | 'items'> {
  /** The UI elements of the Carousel, such as the scroller, navigation, or buttons. */
  children: ReactNode;
  /**
   * Non-visual label for the Carousel that's necessary for the component to be accessible.
   * Should not be used with aria-labelledby.
   */
  'aria-label'?: string;
  /**
   * ID of the element that labels the Carousel.
   * Should not be used with aria-label.
   */
  'aria-labelledby'?: string;
  /**
   * A function that returns a unique key for an item object.
   * @default '(item) => item.key || item.id'
   */
  getItemKey?: (item: CarouselItem) => Key;
}

export interface AriaLabelProps {
  'aria-label': string;
  'aria-labelledby'?: never;
}
export interface AriaLabelledByProps {
  'aria-label'?: never;
  'aria-labelledby': string;
}
export type Label = AriaLabelProps | AriaLabelledByProps;
export type Labelled<T> = Omit<T, keyof Label> & Label;

const {overflow, overflowX, overflowY, ...restLayout} = layout;

const SYSTEM_PROPS = {
  ...common,
  ...restLayout,
} as const;

export type CarouselRef = Readonly<
  Pick<
    UseCarouselResult,
    | 'scrollTo'
    | 'scrollToPreviousPage'
    | 'scrollToNextPage'
    | 'scrollIntoView'
    | 'refresh'
  > & {element: HTMLElement | null}
>;

const Carousel = React.forwardRef(function Carousel<CarouselItem extends Item>(
  props: CarouselProps<CarouselItem>,
  ref: React.ForwardedRef<CarouselRef>
) {
  const defaultProps = useDefaultProps.makeDefaults<
    CarouselProps<CarouselItem>
  >()({
    snapAnchor: 'item',
    getItemKey: (item) => (item?.key as Key) || (item?.id as string),
  });

  const {
    children,
    snapAnchor,
    testIds,
    items,
    onActivePageIndexChange,
    scrollBy,
    orientation,
    onScrollPositionChange,
    getItemKey,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    enableLoopPagination,
    ...rest
    // A TS error arises from the generic typings.
    // @ts-expect-error
  } = useDefaultProps('Carousel', defaultProps, props);

  const elementRef = useRef<HTMLElement | null>(null);
  const carousel = useCarousel({
    onScrollPositionChange,
    onActivePageIndexChange,
    scrollBy,
    orientation,
    enableLoopPagination,
  });

  const {
    scrollToPreviousPage,
    scrollToNextPage,
    scrollTo,
    scrollIntoView,
    refresh,
  } = carousel;

  const scrollThumbRef = useRef<HTMLDivElement | null>(null);
  const {
    isDragging: isScrollbarDragging,
    thumbProps: scrollbarThumbProps,
    trackProps: scrollbarTrackProps,
  } = useScrollbar({
    scrollHost: carousel.scrollerEl,
    scrollThumb: scrollThumbRef.current,
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollIntoView,
      scrollTo,
      scrollToNextPage,
      scrollToPreviousPage,
      refresh,
      element: elementRef.current,
    }),
    [refresh, scrollIntoView, scrollTo, scrollToNextPage, scrollToPreviousPage]
  );

  const context: CarouselContext<CarouselItem> = {
    ...carousel,
    enableLoopPagination: Boolean(enableLoopPagination),
    getItemKey,
    // Causes a conflict with the generic typing.
    // @ts-expect-error
    items,
    snapAnchor,
    isScrollbarDragging,
    scrollbarProps: {
      thumb: {
        ...scrollbarThumbProps,
        ref: scrollThumbRef,
      },
      track: scrollbarTrackProps,
    },
  };

  const [systemProps] = getSystemProps(rest, SYSTEM_PROPS);

  return (
    <CarouselDescendantProvider value={carousel.itemDescendantsManager}>
      <CarouselNavDescendantProvider value={carousel.navItemDescendantsManager}>
        <CarouselContextProvider value={context}>
          <SystemBox
            {...systemProps}
            onKeyDown={carousel.handleRootElKeydown}
            ref={elementRef}
            is="section"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-roledescription={Translation({
              msgid: 'carousel.carouselRoleDescription',
            })}
            data-hb-id="Carousel"
            testIds={testIds}
          >
            {children}
          </SystemBox>
        </CarouselContextProvider>
      </CarouselNavDescendantProvider>
    </CarouselDescendantProvider>
  );
});

const _Carousel = Object.assign(
  // React.forwardRef doesn't support generics
  Carousel as <CarouselItem extends Item>(
    props: Labelled<CarouselProps<CarouselItem>> & {
      ref?: React.ForwardedRef<CarouselRef | undefined>;
    }
  ) => ReactElement,
  {
    Item: CarouselItem,
    Scroller: CarouselScroller,
    Nav: CarouselNav,
    NavItem: CarouselNavItem,
    NextButton: CarouselNextButton,
    PreviousButton: CarouselPreviousButton,
    Scrollbar: CarouselScrollbar,
  }
);

export default _Carousel;
