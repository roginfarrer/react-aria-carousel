'use client';

import React, {forwardRef, ComponentProps} from 'react';
import {
  useCarouselContext,
  useDescendantsContext,
  useCarouselNavDescendant,
} from './utils';
import {SystemBox} from '@homebase/core/dist/Box';
import {getSystemProps} from '@homebase/core/dist/private/getSystemProps';
import {DOMProps, filterDOMProps} from '@private/filterDOMProps';
import {TestIds} from '@root/private/types';
import {createContext} from '@private/context';
import {assert} from '@homebase/core/dist/private/assert';
import {useMergedRef} from '@homebase/core/dist/private/useMergedRef';
import {marker} from '../Carousel.css';
import {useDefaultProps} from '@private/useDefaultProps';

const [NavItemIndexProvider, useNavItemIndex] = createContext<number>();

/**
 * @public
 * @name Carousel.NavItem
 * @system-props all
 */
export interface CarouselNavItemProps
  extends React.ComponentPropsWithoutRef<typeof SystemBox>,
    DOMProps<false>,
    TestIds {
  /** Content of the NavItem */
  children?: React.ReactNode;
}

/**
 * @public
 * @name Carousel.Nav
 * @system-props all
 */
export interface CarouselNavProps<T>
  extends Omit<React.ComponentPropsWithoutRef<typeof SystemBox>, 'children'>,
    DOMProps<false> {
  /** The NavItems contained with the Nav */
  children: (slide: T, index: number) => React.ReactElement;
}

const CarouselNav = forwardRef<HTMLElement, CarouselNavProps<any>>(
  function CarouselNav(props, forwardedRef) {
    const {children, testIds, ...rest} = useDefaultProps(
      'Carousel.Nav',
      {},
      props
    );
    const slides = useDescendantsContext();
    const {getNavProps, refs} = useCarouselContext();
    const assignRef = useMergedRef(forwardedRef, refs.setNavRef);
    const [systemProps, otherProps] = getSystemProps(rest, 'all');

    return (
      <SystemBox
        {...getNavProps()}
        {...filterDOMProps(otherProps)}
        {...systemProps}
        testIds={testIds}
        ref={assignRef}
        is="nav"
      >
        {slides.values().map((slide, index) => {
          assert(!!slide.item?.key, 'No key found for item', 'Carousel');
          return (
            <NavItemIndexProvider value={index} key={slide.item?.key}>
              {children(slide.item, index)}
            </NavItemIndexProvider>
          );
        })}
      </SystemBox>
    );
  }
);

// React.forwardRef doesn't support generics
const _CarouselNav = CarouselNav as <T>(
  props: CarouselNavProps<T> & {ref?: React.ForwardedRef<HTMLElement>}
) => React.ReactElement;
export {_CarouselNav as CarouselNav};

export const CarouselNavItem = forwardRef<
  HTMLButtonElement,
  CarouselNavItemProps
>(function NavItem(props, ref) {
  const index = useNavItemIndex();
  const {register} = useCarouselNavDescendant();
  const {getNavItemProps} = useCarouselContext();
  const assignRef = useMergedRef(ref, register);
  const {children, onClick, testIds, ...rest} = useDefaultProps(
    'Carousel.NavItem',
    {},
    props
  );
  const [{border: propBorder, ...systemProps}, otherProps] = getSystemProps(
    rest,
    'all'
  );

  const markerProps = getNavItemProps({index});

  let border: ComponentProps<typeof SystemBox>['border'] =
    '2px solid transparent';
  if (propBorder) {
    border = propBorder;
  } else if (markerProps['aria-selected']) {
    border = '2px solid $core60';
  }

  return (
    <SystemBox
      border={border}
      {...systemProps}
      {...markerProps}
      {...filterDOMProps(otherProps)}
      className={marker}
      testIds={testIds}
      ref={assignRef}
      onClick={(e) => {
        markerProps.onClick();
        onClick?.(e);
      }}
      is="button"
    >
      {children}
    </SystemBox>
  );
});
