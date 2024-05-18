"use client";

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
      <CarouselScroller className={styles.scroller}>
        <Item index={0} />
        <Item index={1} />
        <Item index={2} />
        <Item index={3} />
        <Item index={4} />
        <Item index={5} />
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

function Item({ index }: { index: number }) {
  return (
    <CarouselItem
      className={styles.item}
      style={{
        backgroundColor: `var(--colors-${colors[index]}-6)`,
      }}
    >
      {index + 1}
    </CarouselItem>
  );
}
