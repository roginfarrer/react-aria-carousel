"use client";

import { CSSProperties } from "react";
import {
  Carousel,
  CarouselButton,
  CarouselButtonProps,
  CarouselProps,
  CarouselScroller,
  CarouselScrollerProps,
  CarouselTab,
  CarouselTabs,
  Item,
} from "@rogin/aria-carousel";

import * as styles from "./PrettyExample.module.css";

export interface Props<T extends object>
  extends Omit<CarouselProps<T>, "children"> {
  aspectRatio?: string;
  children: CarouselScrollerProps<T>["children"];
}

export const StyledCarousel = <T extends object>({
  children,
  aspectRatio,
  orientation = "horizontal",
  ...props
}: Props<T>) => {
  return (
    <Carousel
      {...props}
      aria-label="Featured Collection"
      className={`${styles.root} ${props.className}`}
      orientation={orientation}
      data-orientation={orientation}
    >
      <StyledCarouselButton dir="prev" />
      <CarouselScroller
        className={styles.scroller}
        style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
      >
        {children}
      </CarouselScroller>
      <StyledCarouselButton dir="next" />
      <CarouselTabs className={styles.tabs}>
        {(page) => <CarouselTab index={page.index} className={styles.tab} />}
      </CarouselTabs>
    </Carousel>
  );
};

export function Composed() {
  return (
    <div>
      <StyledCarousel
        aspectRatio="16 / 9"
        spaceBetweenItems="16px"
        initialPages={[[0], [1], [2], [3], [4], [5]]}
        mouseDragging
      >
        <Item key="0">
          <img className="item" src="https://picsum.photos/1600/900?random=1" />
        </Item>
        <Item key="1">
          <img className="item" src="https://picsum.photos/1600/900?random=2" />
        </Item>
        <Item key="2">
          <img className="item" src="https://picsum.photos/1600/900?random=3" />
        </Item>
      </StyledCarousel>
    </div>
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

export function StockItem({ index }: { index: number }) {
  return (
    <div
      className={styles.stockItem}
      style={{
        backgroundColor: `var(--colors-${colors[index]}-6)`,
        aspectRatio: "var(--aspect-ratio)",
      }}
    >
      {index + 1}
    </div>
  );
}

function StyledCarouselButton({ dir, ...props }: CarouselButtonProps) {
  return (
    <CarouselButton
      {...props}
      dir={dir}
      className={styles.button}
      data-dir={dir}
    >
      {dir === "prev" ? (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 320 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 320 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
        </svg>
      )}
    </CarouselButton>
  );
}

export { StyledCarousel as Carousel };
