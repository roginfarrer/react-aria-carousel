'use client';

import React from 'react';
import cx from 'classnames';
import * as styles from '../Carousel.css';
import {useCarouselContext} from './utils';
import {TestIds} from '@root/private/types';
import {SystemBox} from '@homebase/core/dist/Box';
import {
  getSystemProps,
  Common,
  common,
} from '@homebase/core/dist/private/getSystemProps';
import {extendTestIds} from '@homebase/core/dist/private/generateTestIds';
import {useDefaultProps} from '@private/useDefaultProps';

/**
 * @public
 * @name CarouselScrollbar
 * @system-props common
 */
export interface CarouselScrollbarProps extends TestIds, Common {}

export function CarouselScrollbar(props: CarouselScrollbarProps) {
  const {testIds, ...rest} = useDefaultProps('Carousel.Scrollbar', {}, props);
  const {
    isScrollbarDragging: isDragging,
    scrollbarProps: {thumb: thumbProps, track: trackProps},
  } = useCarouselContext();
  const [systemProps] = getSystemProps(rest, common);

  return (
    <SystemBox
      {...trackProps}
      {...systemProps}
      aria-hidden="true"
      className={cx(
        styles.scrollbarTrack,
        isDragging && styles.scrollbarTrackDragging
      )}
    >
      <SystemBox
        {...thumbProps}
        testIds={extendTestIds({testIds, postfix: 'thumb'})}
        ref={thumbProps.ref}
        className={cx(
          styles.scrollbarThumbContainer,
          isDragging && styles.scrollbarThumbContainerDragging
        )}
      >
        <div
          className={cx(
            styles.scrollbarSlider,
            isDragging && styles.scrollbarSliderDragging
          )}
        />
      </SystemBox>
    </SystemBox>
  );
}
