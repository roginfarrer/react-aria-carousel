import {style, styleVariants} from '@vanilla-extract/css';
import {vars} from '@homebase/core';

export const scrollContainer = style({
  display: 'grid',
  maxHeight: 'inherit',
  maxWidth: 'inherit',
  // Hide the native scrollbar
  ':focus-visible': {
    outline: 0,
    border: vars.borders.focus,
    boxShadow: vars.shadows.focus,
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    appearance: 'none',
    width: 0,
    height: 0,
  },
  '::-webkit-scrollbar-thumb': {
    background: 'transparent',
    border: 'none',
  },
});

export const scrollSnapType = styleVariants({
  horizontal: {
    scrollSnapType: 'x mandatory',
  },
  vertical: {
    scrollSnapType: 'y mandatory',
  },
});

export const orientation = styleVariants({
  horizontal: {
    gridAutoFlow: 'column',
    overflowX: 'scroll',
    overflowY: 'hidden',
    overscrollBehaviorX: 'contain',
  },
  vertical: {
    gridAutoFlow: 'row',
    overflowY: 'scroll',
    overflowX: 'hidden',
    overscrollBehaviorY: 'contain',
  },
});

export const item = style({
  overflow: 'hidden',
});

export const itemSnap = style({
  scrollSnapAlign: 'start',
});

export const marker = style({
  ':focus-visible': {
    outline: vars.borders.focus,
    boxShadow: vars.shadows.focus,
  },
});

const SCROLLBAR_HEIGHT = 32;

export const scrollbarTrack = style({
  height: SCROLLBAR_HEIGHT,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '::before': {
    content: '',
    position: 'absolute',
    width: '100%',
    backgroundColor: vars.colors.backgroundInverseSubtle,
    height: 3,
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: vars.radii.large,
  },
  selectors: {
    '&:hover::before': {
      height: 4,
    },
  },
});

export const scrollbarTrackDragging = style({
  '::before': {
    height: 4,
  },
});

export const scrollbarSlider = style({
  height: 3,
  backgroundColor: vars.colors.backgroundInverse,
  borderRadius: vars.radii.large,
  width: '100%',
  selectors: {
    [`&:hover, ${scrollbarTrack}:hover &`]: {
      height: 6,
    },
  },
});

export const scrollbarSliderDragging = style({
  selectors: {
    [`&, &:hover, ${scrollbarTrack}:hover &`]: {
      height: 8,
    },
  },
});

export const scrollbarThumbContainer = style({
  height: SCROLLBAR_HEIGHT,
  position: 'absolute',
  left: 0,
  display: 'flex',
  cursor: 'grab',
  justifyContent: 'center',
  alignItems: 'center',
});

export const scrollbarThumbContainerDragging = style({
  cursor: 'grabbing',
});
