"use client";

import { StockPhoto } from "@/components/Image";
import { flex, grid } from "@/styled-system/patterns";
import clsx from "clsx";
import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "react-aria-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { css } from "@/styled-system/css";

const StyledCarouselButton = ({ dir }: { dir: "next" | "prev" }) => {
  return (
    <CarouselButton
      dir={dir}
      className={clsx(
        flex({
          size: "1.5rem",
          fontSize: "1rem",
          justify: "center",
          align: "center",
          transitionProperty: "translate, scale, box-shadow, color",
          transitionTimingFunction: "ease",
          transitionDuration: ".2s",
          translate: "auto",
          borderRadius: "full",
          _disabled: { color: "gray.400" },
          zIndex: 1,
          "&:not([disabled]):hover": {
            scale: "1.05",
            boxShadow: "0 0 0 4px {colors.gray.200/50}",
            color: "blue.700",
          },
        }),
        dir === "prev" &&
          css({
            gridArea: "prev",
            justifySelf: "flex-end",
            "&:not([disabled]):hover": { x: "-5%" },
          }),
        dir === "next" &&
          css({
            gridArea: "next",
            "&:not([disabled]):hover": { x: "5%" },
          }),
      )}
    >
      {dir === "prev" ? (
        <FaChevronLeft size="1em" />
      ) : (
        <FaChevronRight size="1em" />
      )}
    </CarouselButton>
  );
};

export const HeroCarousel = () => {
  return (
    <Carousel
      aria-label="Featured Collection"
      spaceBetweenItems="8px"
      initialPages={[[0], [1], [2], [3], [4]]}
      itemsPerPage={1.25}
      className={css({
        display: "grid",
        gridTemplateAreas: "'scroll scroll scroll' 'prev nav next'",
        gridTemplateRows: "1fr min-content",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        rowGap: "4",
      })}
    >
      <StyledCarouselButton dir="prev" />
      <StyledCarouselButton dir="next" />
      <CarouselScroller
        className={grid({
          overflow: "auto",
          scrollbar: "hidden",
          gridArea: "scroll",
          scrollSnapType: "x mandatory",
          gridAutoFlow: "column",
        })}
      >
        <Slide index={0} emoji={"🫰"}>
          Browser-native scroll snapping smooth scrolling
        </Slide>
        <Slide index={1} emoji={"🌐"}>
          Top-tier accessibility
        </Slide>
        <Slide index={2} emoji={"💅"}>
          Bring your own styles
        </Slide>
        <Slide index={3} emoji={"😏"}>
          Built with the latest web tech
        </Slide>
        <Slide index={4} emoji={"🤩"}>
          Packed with features!
        </Slide>
      </CarouselScroller>
      <CarouselTabs
        className={flex({
          display: "flex",
          justify: "center",
          alignItems: "start",
          gap: "4",
          gridArea: "nav",
        })}
      >
        {({ index, isSelected }) => (
          <CarouselTab
            key={index}
            index={index}
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
        )}
      </CarouselTabs>
    </Carousel>
  );
};

export function Slide({ emoji, children, index, ...props }) {
  return (
    <CarouselItem
      index={index}
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: "20px",
      })}
    >
      <div
        {...props}
        className={css({
          p: "4",
          aspectRatio: "4 / 3",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textStyle: "2xl",
          borderRadius: "3xl",
          boxShadow: "3px 7px 15px 3px {colors.gray.800/30}",
          textAlign: "center",
          color: "white",
          pos: "relative",
          overflow: "hidden",
          fontWeight: "bold",
        })}
      >
        <StockPhoto
          index={index}
          aria-hidden="true"
          className={css({
            aspectRatio: "4 / 3",
            filter: "brightness(0.7)",
            pos: "absolute",
            inset: 0,
          })}
        />
        <p className={css({ zIndex: 1 })}>
          <span aria-hidden="true" className={css({ display: "block" })}>
            {emoji}
          </span>
          {children}
        </p>
      </div>
    </CarouselItem>
  );
}
