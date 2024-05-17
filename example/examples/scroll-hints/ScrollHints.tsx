"use client";

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

export function ScrollHints() {
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
        <ComposedCarousel scrollPadding="15%" />
      </div>
      <div>
        <h4>Fractional Items per Page</h4>
        <ComposedCarousel itemsPerPage={2.25} />
      </div>
    </div>
  );
}

function ComposedCarousel(props) {
  return (
    <Carousel
      {...props}
      aria-label="Featured Collection"
      className={styles.root}
      spaceBetweenItems="12px"
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
