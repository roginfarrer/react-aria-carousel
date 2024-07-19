import {
  Carousel,
  CarouselAutoplayControl,
  CarouselButton,
  CarouselItem,
  CarouselProps,
  CarouselScroller,
  CarouselScrollerProps,
  CarouselTab,
  CarouselTabs,
} from "../src";

import "./styles.css";

export function ComposedCarousel(
  props: Omit<CarouselProps, "children"> &
    Pick<CarouselScrollerProps<any>, "children">,
) {
  return (
    <Carousel className="root" {...props}>
      <div className="buttons">
        <CarouselAutoplayControl>
          {({ autoplayUserPreference }) => (
            <>
              {autoplayUserPreference ? "Disable autoplay" : "Enable autoplay"}
            </>
          )}
        </CarouselAutoplayControl>
        <CarouselButton dir="prev" className="button">
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className="button">
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className="scroller" data-testid="scroller">
        {props.children}
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

export function Item({ index }: { index: number }) {
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
