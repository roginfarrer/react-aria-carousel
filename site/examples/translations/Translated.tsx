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

export function Translated() {
  return (
    <Carousel
      aria-label="Collezione in primo piano"
      className={styles.root}
      spaceBetweenItems="12px"
      mouseDragging
    >
      <CarouselButton
        className={styles.button}
        data-dir="prev"
        dir="prev"
        aria-label="Pagina precedente"
      >
        <FaChevronLeft />
      </CarouselButton>
      <CarouselScroller
        aria-label="Scorrimento elementi"
        className={styles.scroller}
      >
        <Item label="1 di 3" index={0} />
        <Item label="2 di 3" index={1} />
        <Item label="3 di 3" index={2} />
      </CarouselScroller>
      <CarouselButton
        className={styles.button}
        dir="next"
        data-dir="next"
        aria-label="pagina successiva"
      >
        <FaChevronRight />
      </CarouselButton>
      <CarouselTabs
        className={styles.tabs}
        aria-label="navigazione a carosello"
      >
        {(page) => (
          <CarouselTab
            index={page.index}
            className={styles.tab}
            aria-label={`Vai alla voce ${page.index + 1} di 7`}
          />
        )}
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

function Item({ index, label }: { index: number; label: string }) {
  return (
    <CarouselItem
      aria-label={label}
      className={styles.item}
      style={{
        backgroundColor: `var(--colors-${colors[index]}-6)`,
      }}
    >
      {index + 1}
    </CarouselItem>
  );
}
