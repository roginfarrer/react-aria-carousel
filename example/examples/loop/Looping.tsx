"use client";

import { ChangeEvent, useState } from "react";
import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
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
          <Item index={0} />
          <Item index={1} />
          <Item index={2} />
          <Item index={3} />
          <Item index={4} />
          <Item index={5} />
          <Item index={6} />
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

function Item({ index }: { index: number }) {
  return (
    <CarouselItem
      className={styles.item}
      style={{
        backgroundColor: `var(--colors-${colors[index]}-6)`,
        aspectRatio: "var(--aspect-ratio)",
      }}
    >
      {index + 1}
    </CarouselItem>
  );
}
