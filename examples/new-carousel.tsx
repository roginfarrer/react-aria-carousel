import { useMemo, useRef } from "react";
import { useCarousel, CarouselProps } from "../src/useCarouselFoo.js";
import {
  UseCarouselItemProps,
  useCarouselItem,
} from "../src/useCarouselItem.js";
// import {
//   CarouselProps,
//   CarouselState,
//   useCarouselState,
// } from "../src/useCarouselStateFoo.js";
import "./styles.css";
import { CollectionBase, CollectionStateBase, Node } from "@react-types/shared";
import { Item } from "@react-stately/collections";
import "./styles.css";

const SlideContent = ({ content }: { content: number | string }) => {
  const color = useMemo(
    () => `hsla(${Math.floor(Math.random() * 360)}, 100%, 70%, 1)`,
    [],
  );
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 50,
      }}
    >
      {content}
    </div>
  );
};

const Carousel = <T extends object>(props: CarouselProps<T>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const carousel = useCarousel(props, ref);

  return (
    <div {...carousel.carouselProps} style={{ maxHeight: 500 }}>
      <button {...carousel.prevButtonProps}>Previous</button>
      <div
        {...carousel.carouselScrollerProps}
        className="scrollContainer"
        ref={ref}
      >
        {[...carousel.collection].map((item) => (
          <CarouselItem
            {...carousel}
            item={item}
            index={item.index}
            key={item.key}
          />
        ))}
      </div>
      <button {...carousel.nextButtonProps}>Next</button>
    </div>
  );
};

function CarouselItem<T extends object>(props: UseCarouselItemProps<T>) {
  const { item } = props;
  const stuff = useCarouselItem(props);

  return (
    <div {...stuff.carouselItemProps} className="item">
      {item.rendered}
    </div>
  );
}

const slides = [...Array(10)].map((_, i) => ({ id: `${i}` }));

export function App() {
  return (
    <div>
      <Carousel items={slides} visibleItems={3}>
        {(slide) => (
          <Item textValue={slide.id}>
            <SlideContent content={slide.id} />
          </Item>
        )}
      </Carousel>
    </div>
  );
}
