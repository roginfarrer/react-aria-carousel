'use client';

import * as React from 'react';
import {useCarouselContext} from './utils';
import {mergeRefs} from '@homebase/core/dist/private/mergeRefs';
import {assert} from '@homebase/core/dist/private/assert';
import {getCanAcceptRef} from '@root/private/chakra-descendants/getCanAcceptRef';
import {useDefaultProps} from '@private/useDefaultProps';

/**
 * @name CarouselButton
 * @public
 */
export interface CarouselButtonProps {
  /**
   * The button element or component. It must have a `ref` and `onClick` prop.
   */
  children: React.ReactElement<{
    ref: React.ForwardedRef<HTMLElement>;
    onClick: React.MouseEventHandler;
    disabled: boolean;
  }>;
  /**
   * Handler called with the new page index when the button is clicked.
   */
  onClick?: (index: number) => void;
}

export function CarouselNextButton(props: CarouselButtonProps) {
  const {children, onClick} = useDefaultProps('Carousel.NextButton', {}, props);
  const {
    refs,
    scrollToNextPage,
    activePageIndex,
    pages,
    enableLoopPagination,
  } = useCarouselContext();
  assert(
    React.isValidElement(children) && React.Children.count(children) === 1,
    'Prop `children` expected a single ReactElement.',
    'Carousel.NextButton'
  );
  assert(
    getCanAcceptRef(children),
    'Prop `children` expected a ReactElement that can accept a `ref`.',
    'Carousel.NextButton'
  );
  return React.cloneElement(children, {
    ...children.props,
    disabled:
      children.props.disabled ??
      (enableLoopPagination ? false : activePageIndex >= pages.length - 1),
    ref: mergeRefs((children as any).ref, refs.setNextButtonRef),
    onClick(evt: React.MouseEvent) {
      const index = scrollToNextPage();
      onClick?.(index);
      (children as any).props.onClick?.(evt);
    },
  });
}

export function CarouselPreviousButton(props: CarouselButtonProps) {
  const {children, onClick} = useDefaultProps(
    'Carousel.PreviousButton',
    {},
    props
  );
  const {
    refs,
    scrollToPreviousPage,
    activePageIndex,
    enableLoopPagination,
  } = useCarouselContext();
  assert(
    React.isValidElement(children) && React.Children.count(children) === 1,
    'Prop `children` expected a single ReactElement.',
    'Carousel.PreviousButton'
  );
  assert(
    getCanAcceptRef(children),
    'Prop `children` expected a ReactElement that can accept a `ref`.',
    'Carousel.NextButton'
  );
  return React.cloneElement(children, {
    ...children.props,
    disabled:
      children.props.disabled ??
      (enableLoopPagination ? false : activePageIndex <= 0),
    ref: mergeRefs((children as any).ref, refs.setPrevButtonRef),
    onClick(evt: React.MouseEvent) {
      const index = scrollToPreviousPage();
      onClick?.(index);
      (children as any).props.onClick?.(evt);
    },
  });
}
