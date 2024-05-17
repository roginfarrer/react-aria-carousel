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

const items = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }];

export function Dynamic() {
  return (
    <Carousel className={styles.root} spaceBetweenItems="16px" items={items}>
      <div className={styles.buttons}>
        <CarouselButton dir="prev" className={styles.button}>
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className={styles.button}>
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className={styles.scroller}>
        {items.map((item) => (
          <Item key={item.index}>
            <Image index={item.index} />
          </Item>
        ))}
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
