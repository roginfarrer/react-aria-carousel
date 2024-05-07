import { Item } from "@react-stately/collections";

import { Carousel } from "./components.js";

import "./styles.css";

import { useState } from "react";

import { css } from "../styled-system/css";
import { flex } from "../styled-system/patterns";
import { token } from "../styled-system/tokens";

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
      })}
    >
      {children}
    </div>
  );
}

const items = [...Array(12)].map((_, i) => ({ i }));

export function App() {
  const [stateItems, setItems] = useState(items);
  const update = (add: boolean) =>
    add
      ? setItems((prev) => [...prev, { i: prev.length }])
      : setItems((prev) => {
          const updated = [...prev];
          updated.pop();
          return updated;
        });
  return (
    <div className={flex({ width: "100%", direction: "column", gap: "36px" })}>
      <div>
        <button onClick={() => update(false)}>Remove</button>
        <button onClick={() => update(true)}>Add</button>
      </div>
      <Carousel
        items={stateItems}
        spaceBetweenSlides="16px"
        itemsPerPage={3}
        loop="infinite"
      >
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
      <Carousel
        items={items}
        spaceBetweenSlides="16px"
        itemsPerPage={3}
        loop="native"
      >
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
      <Carousel items={items} spaceBetweenSlides="16px" scrollPadding="10%">
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
      <Carousel items={items} spaceBetweenSlides="16px" itemsPerPage={1.1}>
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
