"use client";

import { ComponentPropsWithoutRef } from "react";
import { useMediaQuery } from "@/hooks/useMatchMedia";
import { flex, grid } from "@/styled-system/patterns";
import { token } from "@/styled-system/tokens";
import clsx from "clsx";
import {
  Carousel,
  CarouselButton,
  CarouselOptions,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
  Item,
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
  const isLargeScreen = useMediaQuery("(min-width: 800px)");

  return (
    <Carousel
      aria-label="Featured Collection"
      spaceBetweenItems="8px"
      initialPages={[[0], [1], [2], [3], [4]]}
      itemsPerPage={isLargeScreen ? 2 : 1.25}
      className={css({
        display: "grid",
        gridTemplateAreas: "'scroll scroll scroll' 'prev nav next'",
        gridTemplateRows: "1fr min-content",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        rowGap: "2",
        "--perspective": "600",
        "--rotate-x": "-18",
        "--rotate-y": "-26",
        "--rotate-z": "5",
        "--translate-z": "37",
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
          "--perspective": "600",
          "--rotate-x": "-18",
          "--rotate-y": "-26",
          "--rotate-z": "5",
          "--translate-z": "37",
          transformStyle: "preserve-3d",
          //           transform: `
          //     /* Set the point of view */
          //     perspective( calc( var(--perspective, 850) * 1px ) )
          //     /* Transform the element in all 3 dimensions */
          //     rotateX( calc( var(--rotate-x) * 1deg ) )
          //     rotateY( calc( var(--rotate-y) * 1deg ) )
          //     rotateZ( calc( var(--rotate-z) * 1deg ) )
          //     /* Transform the element over the Z axis */
          //     translateZ( calc( var(--translate-z) * 1px ) )
          // translateY(-20%)`,
        })}
      >
        <Item key="a">
          <Slide index={1} emoji={"🫰"}>
            Browser-native scroll snapping smooth scrolling
          </Slide>
        </Item>
        <Item key="c">
          <Slide index={2} emoji={"🌐"}>
            Top-tier accessibility
          </Slide>
        </Item>
        <Item key="d">
          <Slide index={3} emoji={"💅"}>
            Bring your own styles
          </Slide>
        </Item>
        <Item key="f">
          <Slide index={0} emoji={"😏"}>
            Built with the latest web tech
          </Slide>
        </Item>
        <Item key="e">
          <Slide index={4} emoji={"🤩"}>
            Packed with features!
          </Slide>
        </Item>
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

export function Slide({ emoji, children, index, ...props }) {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "30dvh",
        p: "20px",
      })}
    >
      <div
        {...props}
        className={css({
          // height: "20dvh",
          p: "4",
          aspectRatio: "15 / 16",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textStyle: "2xl",
          borderRadius: "3xl",
          boxShadow: "3px 7px 15px 3px {colors.gray.800/30}",
          textAlign: "center",
        })}
        style={{
          backgroundColor: token(`colors.${colors[index]}.200` as never),
        }}
      >
        <span aria-hidden="true" className={css({ display: "block" })}>
          {emoji}
        </span>
        {children}
      </div>
    </div>
  );
}
