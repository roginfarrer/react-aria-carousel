import { useMemo } from "react";
import { Item } from "@react-stately/collections";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import {
  CarouselAria,
  CarouselItemOptions,
  CarouselNavItemOptions,
  CarouselOptions,
  useCarousel,
  useCarouselItem,
  useCarouselNavItem,
} from "..";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { token } from "../../styled-system/tokens";

export const Carousel = <T extends object>(props: CarouselOptions<T>) => {
  const [assignRef, carousel] = useCarousel(props);

  return (
    <div
      {...carousel.rootProps}
      className={css({
        maxHeight: 500,
        display: "grid",
        gridTemplateAreas: "'. scroll .' '. nav .'",
        gridAutoColumns: "min-content 1fr min-content",
        gridAutoRows: "1fr min-content",
        alignItems: "center",
      })}
    >
      <div
        {...carousel.scrollerProps}
        data-orientation={props.orientation ?? "horizontal"}
        className="scrollContainer"
        ref={assignRef}
        style={{ ...carousel.scrollerProps?.style, gridArea: "scroll" }}
      >
        {[...carousel.collection].map((item) => (
          <CarouselItem state={carousel} item={item} key={item.key} />
        ))}
      </div>
      <button
        {...carousel.prevButtonProps}
        aria-label="Previous"
        className={css({
          px: "4",
          display: "flex",
        })}
      >
        <FaChevronLeft />
      </button>
      <button
        {...carousel.nextButtonProps}
        aria-label="Next"
        className={css({
          px: "4",
          display: "flex",
          transition: "transform ease .2s",
          _hover: {
            transform: "translateX(5%) scale(1.05)",
          },
        })}
      >
        <FaChevronRight />
      </button>
      <div
        {...carousel.navProps}
        className={flex({
          display: "flex",
          justify: "center",
          alignItems: "start",
          gap: "4",
          mt: "6",
          gridArea: "nav",
        })}
      >
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
  const stuff = useCarouselItem(props, state);

  return (
    <div {...stuff.itemProps} className="item">
      {item.rendered}
    </div>
  );
}

const colors = [
  "emerald",
  "violet",
  "sky",
  "yellow",
  "lime",
  "stone",
  "slate",
  "fuchsia",
  "purple",
  "blue",
  "pink",
  "green",
  "red",
  "orange",
  "rose",
];

function Slide({ children, ...props }) {
  return (
    <div
      {...props}
      className={css({
        width: "100%",
        maxHeight: "500px",
        minHeight: "10em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textStyle: "2xl",
        borderRadius: "3xl",
      })}
    >
      {children}
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
      className={css({
        rounded: "full",
        size: "4",
        backgroundColor: isSelected ? "gray.700" : "gray.300",
        transition: "background-color .2s ease",
        "&:hover": {
          bg: "gray.500",
        },
      })}
    />
  );
}

const getItems = (count: number) => [...Array(count)].map((_, i) => ({ i }));

export function ComposedCarousel<T extends object>(
  props: CarouselOptions<T> & { itemCount: number } = { itemCount: 12 },
) {
  const items = useMemo(() => getItems(props.itemCount), [props.itemCount]);
  return (
    <div style={{ minWidth: "100%" }}>
      <Carousel items={items} {...props}>
        {(item) => (
          <Item key={item.i}>
            <Slide
              style={{
                backgroundColor: token(`colors.${colors[item.i]}.200` as never),
              }}
            >
              {item.i + 1}
            </Slide>
          </Item>
        )}
      </Carousel>
    </div>
  );
}
