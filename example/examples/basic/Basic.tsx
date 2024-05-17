"use client";

import { StockPhoto } from "@/components/Image";
import {
  Carousel,
  CarouselButton,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
  Item,
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
        <Item key="a">
          <Image index={0} />
        </Item>
        <Item key="b">
          <Image index={1} />
        </Item>
        <Item key="c">
          <Image index={2} />
        </Item>
        <Item key="d">
          <Image index={3} />
        </Item>
        <Item key="e">
          <Image index={4} />
        </Item>
        <Item key="f">
          <Image index={5} />
        </Item>
        <Item key="g">
          <Image index={6} />
        </Item>
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

function Image({ index }: { index: number }) {
  return (
    <div className={styles.item}>
      <StockPhoto index={index} />
    </div>
  );
}
