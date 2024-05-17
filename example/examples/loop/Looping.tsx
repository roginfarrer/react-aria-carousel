"use client";

import { ChangeEvent, useState } from "react";
import {
  Carousel,
  CarouselButton,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
  Item,
} from "react-aria-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import styles from "./styles.module.css";

export function Looping() {
  const [loop, setLoop] = useState<"infinite" | "native">("infinite");

  function handleChange(e: ChangeEvent) {
    setLoop((e.target as HTMLInputElement).value as "infinite" | "native");
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
      <Carousel
        aria-label="Featured Collection"
        className={styles.root}
        spaceBetweenItems="12px"
        loop={loop}
      >
        <CarouselButton className={styles.button} data-dir="prev" dir="prev">
          <FaChevronLeft />
        </CarouselButton>
        <CarouselScroller
          className={styles.scroller}
          style={{ "--aspect-ratio": "16 / 9" }}
        >
          <Item key="a">
            <Image>1</Image>
          </Item>
          <Item key="b">
            <Image>2</Image>
          </Item>
          <Item key="c">
            <Image>3</Image>
          </Item>
          <Item key="d">
            <Image>4</Image>
          </Item>
          <Item key="e">
            <Image>5</Image>
          </Item>
          <Item key="f">
            <Image>6</Image>
          </Item>
        </CarouselScroller>
        <CarouselButton className={styles.button} dir="next" data-dir="next">
          <FaChevronRight />
        </CarouselButton>
        <CarouselTabs className={styles.tabs}>
          {(page) => <CarouselTab index={page.index} className={styles.tab} />}
        </CarouselTabs>
      </Carousel>
    </>
  );
}

const colors = [
  "sky",
  "red",
  "green",
  "blue",
  "orange",
  "violet",
  "lime",
  "fuchsia",
  "purple",
  "pink",
  "rose",
];

function Image({ children }: { children: string }) {
  return (
    <div
      className={styles.item}
      style={{
        backgroundColor: `var(--colors-${colors[parseInt(children, 10) - 1]}-6)`,
        aspectRatio: "var(--aspect-ratio)",
      }}
    >
      {children}
    </div>
  );
}
