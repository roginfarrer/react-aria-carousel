"use client";

import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "@rogin/aria-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import * as styles from "./styles.module.css";

export function MultipleItems() {
  return (
    <Carousel
      aria-label="Featured Collection"
      className={styles.root}
      itemsPerPage={2}
      spaceBetweenItems="12px"
    >
      <CarouselButton className={styles.button} data-dir="prev" dir="prev">
        <FaChevronLeft />
      </CarouselButton>
      <CarouselScroller
        className={styles.scroller}
        style={{ "--aspect-ratio": "4 / 3" } as CSSProperties}
      >
        <CarouselItem key="a">
          <Item>1</Item>
        </CarouselItem>
        <CarouselItem key="b">
          <Item>2</Item>
        </CarouselItem>
        <CarouselItem key="c">
          <Item>3</Item>
        </CarouselItem>
        <CarouselItem key="d">
          <Item>4</Item>
        </CarouselItem>
        <CarouselItem key="e">
          <Item>5</Item>
        </CarouselItem>
        <CarouselItem key="f">
          <Item>6</Item>
        </CarouselItem>
      </CarouselScroller>
      <CarouselButton className={styles.button} dir="next" data-dir="next">
        <FaChevronRight />
      </CarouselButton>
      <CarouselTabs className={styles.tabs}>
        {(page) => <CarouselTab index={page.index} className={styles.tab} />}
      </CarouselTabs>
    </Carousel>
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

function Item({ children }: { children: string }) {
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
