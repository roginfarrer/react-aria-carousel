"use client";

import { StockPhoto } from "@/components/Image";
import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "react-aria-carousel";

import styles from "./styles.module.css";

export function Basic() {
  return (
    <Carousel className={styles.root} spaceBetweenItems="16px">
      <div className={styles.buttons}>
        <CarouselButton dir="prev" className={styles.button}>
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className={styles.button}>
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className={styles.scroller}>
        <Item index={0} />
        <Item index={1} />
        <Item index={2} />
        <Item index={3} />
        <Item index={4} />
      </CarouselScroller>
      <CarouselTabs className={styles.tabs}>
        {(item) => (
          <CarouselTab className={styles.tab} index={item.index}>
            {item.index + 1}
          </CarouselTab>
        )}
      </CarouselTabs>
    </Carousel>
  );
}

function Item({ index }: { index: number }) {
  return (
    <CarouselItem className={styles.item}>
      <StockPhoto index={index} />
    </CarouselItem>
  );
}
