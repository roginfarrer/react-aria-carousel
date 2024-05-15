"use client";

import { Item } from "@rogin/aria-carousel";

import { StockItem, StyledCarousel } from "./PrettyComponentExample";

export function Demo() {
  return (
    <StyledCarousel aspectRatio="3 / 2" spaceBetweenItems="16px" mouseDragging>
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
