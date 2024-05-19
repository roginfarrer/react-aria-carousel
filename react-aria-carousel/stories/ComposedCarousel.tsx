import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselProps,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "../src";

import "./styles.css";

export function ComposedCarousel(props: CarouselProps) {
  return (
    <Carousel className="root" {...props}>
      <div className="buttons">
        <CarouselButton dir="prev" className="button">
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className="button">
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className="scroller">
        <Item index={0} />
        <Item index={1} />
        <Item index={2} />
        <Item index={3} />
      </CarouselScroller>
      <CarouselTabs className="tabs">
        {(item) => (
          <CarouselTab className="tab" index={item.index}>
            {item.index + 1}
          </CarouselTab>
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

function Item({ index }: { index: number }) {
  return (
    <CarouselItem
      className="item"
      style={{
        backgroundColor: `var(--colors-${colors[index]}-200)`,
      }}
    >
      {index + 1}
    </CarouselItem>
  );
}
