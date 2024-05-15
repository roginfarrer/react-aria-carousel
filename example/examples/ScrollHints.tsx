"use client";

import { Item } from "@rogin/aria-carousel";

import { StockItem, StyledCarousel } from "./PrettyComponentExample";

export function Demo() {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexDirection: "column",
      }}
    >
      <div>
        <h4 style={{ marginTop: 0 }}>Scroll Padding</h4>
        <StyledCarousel
          aspectRatio="3 / 2"
          spaceBetweenItems="16px"
          scrollPadding="15%"
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
      </div>
      <div>
        <h4>Fractional Items per Page</h4>
        <StyledCarousel
          aspectRatio="4 / 3"
          spaceBetweenItems="16px"
          itemsPerPage={2.25}
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
      </div>
    </div>
  );
}
