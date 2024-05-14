import { CSSProperties } from "react";

import {
  useCarousel,
  useCarouselItem,
  useCarouselNavItem,
  type CarouselAria,
  type CarouselItemOptions,
  type CarouselNavItemOptions,
  type CarouselOptions,
} from "..";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "16px",
  },
  scroller: {
    display: "grid",
    overflow: "auto",
    scrollSnapType: "x mandatory",
    gridAutoFlow: "column",
    scrollbarWidth: "none",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  button: { all: "revert" },
  nav: {
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    gap: "16px",
  },
  navItem: {
    all: "revert",
  },
  item: {
    background: "rgb(186, 230, 253)",
    aspectRatio: "16 / 9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
} satisfies Record<string, CSSProperties>;

export const BasicExampleCarousel = <T extends object>(
  props: CarouselOptions<T>,
) => {
  const [assignRef, carousel] = useCarousel(props);

  const {
    rootProps,
    prevButtonProps,
    nextButtonProps,
    scrollerProps,
    navProps,
    collection,
  } = carousel;

  return (
    <div {...rootProps} style={styles.root}>
      <div style={styles.buttons}>
        <button {...prevButtonProps} style={styles.button}>
          Previous
        </button>
        <button {...nextButtonProps} style={styles.button}>
          Next
        </button>
      </div>
      <div
        {...scrollerProps}
        ref={assignRef}
        style={{
          ...styles.scroller,
          ...scrollerProps.style,
        }}
      >
        {[...collection].map((item) => (
          <CarouselItem state={carousel} item={item} key={item.key} />
        ))}
      </div>
      <div {...navProps} style={styles.nav}>
        {carousel.pages.map((_, i) => (
          <CarouselNavItem key={i} index={i} state={carousel} />
        ))}
      </div>
    </div>
  );
};

export function CarouselItem<T extends object>(
  props: CarouselItemOptions<T> & { state: CarouselAria<T> },
) {
  const { item, state } = props;
  const { itemProps } = useCarouselItem(props, state);

  return (
    <div
      {...itemProps}
      style={{
        ...styles.item,
        backgroundColor:
          item.index! % 2 ? "rgb(186, 230, 253)" : "rgb(221, 214, 254)",
      }}
    >
      {item.rendered}
    </div>
  );
}

export function CarouselNavItem<T extends object>(
  props: CarouselNavItemOptions & { state: CarouselAria<T> },
) {
  const { index, state } = props;
  const { navItemProps, isSelected } = useCarouselNavItem({ index }, state);
  return (
    <button
      type="button"
      {...navItemProps}
      style={{
        ...styles.navItem,
        backgroundColor: isSelected ? "darkgray" : undefined,
      }}
    >
      {index + 1}
    </button>
  );
}
