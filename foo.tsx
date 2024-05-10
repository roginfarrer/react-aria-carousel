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
    display: "grid",
    gridTemplateAreas: "'. scroll .' '. nav .'",
    gridAutoColumns: "min-content 1fr min-content",
    gridAutoRows: "1fr min-content",
    alignItems: "center",
  },
  scroller: {
    gridArea: "scroll",
  },
  nav: {
    gridArea: "nav",
    display: "flex",
    justify: "center",
    alignItems: "start",
    gap: "16px",
    mt: "24px",
  },
  item: {
    fontSize: "2.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "4 / 3",
  },
};

export const Carousel = <T extends object>(props: CarouselOptions<T>) => {
  const [assignRef, carousel] = useCarousel(props);

  return (
    <div {...carousel.rootProps} style={styles.root}>
      <div
        {...carousel.scrollerProps}
        ref={assignRef}
        style={{ ...carousel.scrollerProps.style, ...styles.scroller }}
      >
        {[...carousel.collection].map((item) => (
          <CarouselItem state={carousel} item={item} key={item.key} />
        ))}
      </div>
      <button {...carousel.prevButtonProps}>{"<"}</button>
      <button {...carousel.nextButtonProps}>{">"}</button>
      <div {...carousel.navProps} style={styles.nav}>
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

  return <div {...itemProps}>{item.rendered}</div>;
}

export function CarouselNavItem<T extends object>(
  props: CarouselNavItemOptions & { state: CarouselAria<T> },
) {
  const { index, state } = props;
  const { navItemProps } = useCarouselNavItem({ index }, state);
  return <button type="button" {...navItemProps} />;
}
