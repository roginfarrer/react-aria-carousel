"use client";

import "smoothscroll-polyfill";

import { ComponentProps, useEffect, useRef, useState } from "react";
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
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

import { scrollEndPolyfill } from "./scrollend-polyfill";
import { css } from "@/styled-system/css";

const StyledCarouselButton = ({ dir }: { dir: "next" | "prev" }) => {
  return (
    <CarouselButton
      dir={dir}
      className={clsx(
        flex({
          size: "1.25rem",
          fontSize: "1rem",
          justify: "center",
          align: "center",
          transitionProperty: "all",
          transitionTimingFunction: "ease",
          transitionDuration: ".2s",
          translate: "auto",
          borderRadius: "full",
          "&[aria-disabled]": { color: "gray.400" },
          zIndex: 1,
          "&:not([aria-disabled]):hover": {
            scale: "1.05",
          },
        }),
        dir === "prev" &&
          css({
            gridArea: "nav",
            justifySelf: "flex-end",
            "&:not([aria-disabled]):hover": { x: "-5%" },
          }),
        dir === "next" &&
          css({
            gridArea: "nav",
            justifySelf: "start",
            "&:not([aria-disabled]):hover": { x: "5%" },
          }),
      )}
    >
      {dir === "prev" ? (
        <FaCaretLeft size="1em" />
      ) : (
        <FaCaretRight size="1em" />
      )}
    </CarouselButton>
  );
};

export const HeroCarousel = () => {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    scrollEndPolyfill();
  }, []);

  function handleLoad() {
    if (ref.current) {
      ref.current.scrollLeft = 0;
      setReady(true);
    }
  }

  return (
    <Carousel
      aria-label="React Aria Carousel features"
      spaceBetweenItems="40px"
      initialPages={[[0], [1], [2], [3], [4]]}
      itemsPerPage={1}
      style={{ visibility: ready ? undefined : "hidden" }}
      className={css({
        display: "grid",
        gridTemplateAreas:
          "'scroll scroll scroll' 'controls controls controls'",
        gridTemplateRows: "1fr min-content",
        position: "relative",
        rowGap: "4",
        maxWidth: 800,
        pos: "relative",
        py: "5%",
        "&::before": {
          // content: "''",
          background: "linear-gradient(to right, white, transparent)",
          height: "100%",
          width: "50px",
          pos: "absolute",
          top: 0,
          left: "0",
          zIndex: "1",
        },
        "&::after": {
          // content: "''",
          background: "linear-gradient(to left, white, transparent)",
          height: "100%",
          width: "50px",
          pos: "absolute",
          top: 0,
          right: "-10px",
        },
      })}
    >
      <CarouselScroller
        ref={ref}
        className={grid({
          pt: "8%",
          pb: "4%",
          px: "25%",
          scrollPaddingInline: { base: "25%", md: "5%" },
          overflow: "auto",
          scrollbar: "hidden",
          gridArea: "scroll",
          scrollSnapType: "x mandatory",
          gridAutoFlow: "column",
          pos: "relative",
        })}
      >
        <Slide index={0} emoji={"🫰"} onLoad={handleLoad}>
          Browser-native scroll snapping & smooth scrolling
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
      <div
        className={flex({
          gridArea: "controls",
          justifySelf: "center",
          // translate: "-20% 0",
        })}
      >
        <StyledCarouselButton dir="prev" />
        <CarouselTabs
          className={flex({
            gap: "4",
            gridArea: "nav",
            px: "1.25rem",
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
        <StyledCarouselButton dir="next" />
      </div>
    </Carousel>
  );
};

export function Slide({
  emoji,
  children,
  index,
  onLoad,
  ...props
}: {
  emoji: string;
  children: string;
  index: number;
  onLoad?: ComponentProps<"img">["onLoad"];
}) {
  return (
    <CarouselItem
      index={index}
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <div
        {...props}
        className={css({
          "--ratio": "16/9",
          aspectRatio: "var(--ratio)",
          width: "100%",
          // maxHeight: 300,
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
          onLoad={onLoad}
          className={css({
            filter: "brightness(0.7)",
            aspectRatio: "var(--ratio)",
            pos: "absolute",
            inset: 0,
          })}
        />
        <p className={css({ zIndex: 1, p: "4" })}>
          <span aria-hidden="true" className={css({ display: "block" })}>
            {emoji}
          </span>
          {children}
        </p>
      </div>
    </CarouselItem>
  );
}
