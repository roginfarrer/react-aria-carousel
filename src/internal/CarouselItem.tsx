'use client';

import React, {forwardRef, ReactNode} from 'react';
import cx from 'classnames';
import type {TestIds} from '@private/types';
import {
  getSystemProps,
  FlexContainer,
  GridContainer,
  Color,
  flexContainer,
  color,
  gridContainer,
} from '@homebase/core/dist/private/getSystemProps';
import {useMergedRef} from '@homebase/core/dist/private/useMergedRef';
import {SystemBox} from '@homebase/core/dist/Box';
import {useCarouselContext, useDescendant, useItemContext} from './utils';
import {useDefaultProps} from '@private/useDefaultProps';
import * as styles from '../Carousel.css';

/**
 * @public
 * @name Carousel.Item
 * @system-props flexContainer, gridContainer, color
 */
export interface ItemProps
  extends TestIds,
    FlexContainer,
    GridContainer,
    Color {
  /** The content of the item */
  children?: ReactNode;
  /** Unique identifier of the item */
  key?: string;
}

const ITEM_SYSTEM_PROPS = {
  $$groups: ['flexContainer', 'gridContainer', 'color'],
  ...flexContainer,
  ...gridContainer,
  ...color,
};

export const CarouselItem = forwardRef<HTMLDivElement, ItemProps>(function Item(
  props,
  forwardedRef
) {
  const {children, testIds, ...rest} = useDefaultProps(
    'Carousel.Item',
    {},
    props
  );
  const context = useCarouselContext();
  const item = useItemContext();
  const {index, register} = useDescendant({
    item: {...item, key: context.getItemKey(item)},
  });
  const assignRef = useMergedRef(register, forwardedRef);
  const {snapPointIndexes, snapAnchor} = context;
  const [systemProps] = getSystemProps(rest, ITEM_SYSTEM_PROPS);

  return (
    <SystemBox
      {...systemProps}
      {...context.getItemProps({index})}
      className={cx(styles.item, {
        [styles.itemSnap]:
          snapAnchor === 'item' ||
          (snapAnchor === 'page' && snapPointIndexes.has(index)),
      })}
      ref={assignRef}
      testIds={testIds}
      data-hb-id="Carousel.Item"
    >
      {children}
    </SystemBox>
  );
});
