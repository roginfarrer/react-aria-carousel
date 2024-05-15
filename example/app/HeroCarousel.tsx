"use client";

import { Item } from "@rogin/aria-carousel";

import { StockItem, StyledCarousel } from "../examples/PrettyComponentExample";
import * as styles from "../examples/PrettyExample.module.css";
import { css } from "@/styled-system/css";

export function HeroCarousel() {
  return (
    <StyledCarousel
      className={css({
        '& [role="group"]': {
          gridAutoColumns: "calc(100% + 24px)!",
        },
        [`& [aria-roledescription="carousel item"]`]: {
          boxShadow: "10px 9px 10px 2px rgba(0, 0, 0, .1)",
          borderRadius: "3xl",
          // background: "transparent",
        },
      })}
      aspectRatio="16 / 9"
      spaceBetweenItems="20px"
      loop="infinite"
      autoplay
      autoplayInterval={5000}
    >
      <Item key="a">
        <StockItem index={0} />
      </Item>
      <Item key="b">
        <StockItem index={1} />
      </Item>
      <Item key="c">
        <StockItem index={2} />
      </Item>
      <Item key="d">
        <StockItem index={3} />
      </Item>
      <Item key="e">
        <StockItem index={4} />
      </Item>
      <Item key="f">
        <StockItem index={5} />
      </Item>
    </StyledCarousel>
  );
}
