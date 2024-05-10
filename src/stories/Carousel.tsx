import { ComponentPropsWithoutRef, CSSProperties, useMemo } from "react";
import clsx from "clsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import {
  CarouselAria,
  CarouselItemOptions,
  CarouselNavItemOptions,
  CarouselOptions,
  Item,
  useCarousel,
  useCarouselItem,
  useCarouselNavItem,
} from "..";
import { grid } from "../../example/styled-system/patterns";
import { css } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { token } from "../../styled-system/tokens";

const CarouselButton = ({
  dir,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "dir" | "children"> & {
  dir: "next" | "prev";
}) => {
  return (
    <button
      {...props}
      className={clsx(
        flex({
          size: "36px",
          fontSize: "1.25rem",
          justify: "center",
          align: "center",
          transitionProperty: "translate, scale, box-shadow, color",
          transitionTimingFunction: "ease",
          transitionDuration: ".2s",
          // transition: "translate ease .2s, scale ease .2s, box-shadow ease .2s",
          translate: "auto",
          borderRadius: "full",
          _disabled: { color: "gray.400" },
          "&:not([disabled]):hover": {
            scale: "1.05",
            boxShadow: "0 0 0 4px {colors.gray.200/50}",
            color: "blue.700",
          },
        }),
        dir === "prev" && css({ "&:not([disabled]):hover": { x: "-5%" } }),
        dir === "next" && css({ "&:not([disabled]):hover": { x: "5%" } }),
        props.className,
      )}
    >
      {dir === "prev" ? (
        <FaChevronLeft size="1em" />
      ) : (
        <FaChevronRight size="1em" />
      )}
    </button>
  );
};

export const Carousel = <T extends object>(
  props: CarouselOptions<T> & { aspectRatio?: string },
) => {
  const [assignRef, carousel] = useCarousel(props);

  return (
    <div
      {...carousel.rootProps}
      aria-label="Featured Collection"
      className={css({
        display: "grid",
        gridTemplateAreas: "'. scroll .' '. nav .'",
        gridAutoColumns: "min-content 1fr min-content",
        gridAutoRows: "1fr min-content",
        alignItems: "center",
        columnGap: "4",
      })}
    >
      <CarouselButton dir="prev" {...carousel.prevButtonProps} />
      <div
        {...carousel.scrollerProps}
        className={grid({
          scrollbar: "hidden",
          overflow: "auto",
          '&[data-orientation="vertical"]': {
            scrollSnapType: "y mandatory",
            gridAutoFlow: "row",
            overscrollBehaviorY: "contain",
          },
          '&[data-orientation="horizontal"]': {
            scrollSnapType: "x mandatory",
            gridAutoFlow: "column",
            overscrollBehaviorX: "contain",
          },
        })}
        ref={assignRef}
        style={{ ...carousel.scrollerProps?.style, gridArea: "scroll" }}
      >
        {[...carousel.collection].map((item) => (
          <CarouselItem
            state={carousel}
            item={item}
            key={item.key}
            aspectRatio={props.aspectRatio}
          />
        ))}
      </div>
      <CarouselButton dir="next" {...carousel.nextButtonProps} />
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
  props: CarouselItemOptions<T> & {
    state: CarouselAria<T>;
    aspectRatio?: string;
  },
) {
  const { item, state } = props;
  const stuff = useCarouselItem(props, state);

  return (
    <div
      {...stuff.itemProps}
      className={flex({
        overflow: "hidden",
        aspectRatio: "var(--aspect-ratio)",
      })}
      style={{ "--aspect-ratio": props.aspectRatio } as CSSProperties}
    >
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

export function Slide({ index, ...props }) {
  return (
    <div
      {...props}
      className={css({
        width: "100%",
        // maxHeight: "500px",
        // minHeight: "10em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textStyle: "2xl",
        borderRadius: "3xl",
      })}
      style={{ backgroundColor: token(`colors.${colors[index]}.200` as never) }}
    >
      {index + 1}
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

export function ComposedCarousel(
  props: CarouselOptions<{ src: string }> & { itemCount: number },
) {
  const items = useMemo(
    () =>
      Array.from({ length: props.itemCount }, (_, i) => ({
        src: `https://picsum.photos/1600/900?random=${i}`,
      })),
    [props.itemCount],
  );
  return (
    <div style={{ minWidth: "100%" }}>
      <Carousel {...props} />
    </div>
  );
}
