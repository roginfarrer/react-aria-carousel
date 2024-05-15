"use client";

import { useState } from "react";
import { Item } from "@rogin/aria-carousel";

import { StockItem, StyledCarousel } from "./PrettyComponentExample";

export function LoopingExample() {
  const [loop, setLoop] = useState("infinite");

  function handleChange(e) {
    setLoop(e.target.value);
  }

  return (
    <>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <label>
          <input
            type="radio"
            value="infinite"
            onChange={handleChange}
            checked={loop === "infinite"}
          />
          Infinite looping
        </label>
        <label>
          <input
            type="radio"
            value="native"
            onChange={handleChange}
            checked={loop === "native"}
          />
          Native looping
        </label>
      </div>
      <StyledCarousel aspectRatio="16 / 9" spaceBetweenItems="16px" loop={loop}>
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
    </>
  );
}
