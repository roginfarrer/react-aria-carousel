import { useMemo, useRef, useState } from "react";
import {
  useCarousel as useCarouselBar,
  useCarouselItem as useCarouselItemBar,
  useCarouselNavItem as useCarouselNavItemBar,
} from "../src/useCarouselBar.js";
import { useCarousel, CarouselProps } from "../src/useCarouselFoo.js";
import {
  UseCarouselItemProps,
  useCarouselItem,
} from "../src/useCarouselItem.js";
import { Item } from "@react-stately/collections";
import "./styles.css";
import { Node } from "@react-types/shared";
import { useCarouselNavItem } from "../src/useCarouselNavItem.js";

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
    <div {...carousel.rootProps} style={{ maxHeight: 500 }}>
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
      <nav>
        {carousel.pages.map((_, i) => (
          <CarouselNavItem index={i} state={carousel} />
        ))}
      </nav>
      <button {...carousel.nextButtonProps}>Next</button>
    </div>
  );
};

function CarouselItem<T extends object>(
  props: UseCarouselItemProps & { item: Node<T> },
) {
  const { item } = props;
  const stuff = useCarouselItem(props);

  return (
    <div {...stuff.carouselItemProps} className="item">
      {item.rendered}
    </div>
  );
}

function CarouselNavItem({ index, state }) {
  const { navItemProps, isSelected } = useCarouselNavItem({ index }, state);
  return (
    <button
      type="button"
      {...navItemProps}
      style={{ transform: isSelected ? "scale(1.1)" : "" }}
    >
      {index}
    </button>
  );
}

const slides = [...Array(10)].map((_, i) => ({ id: `${i}` }));

function New(props) {
  const [scroller, setScroller] = useState();
  const [items, setItems] = useState(slides);
  function updateItems(change: "add" | "remove") {
    setItems((prev) => {
      if (change === "add") {
        return [...prev, { id: `${prev.length + 1}` }];
      }
      return prev.slice(0, prev.length - 1);
    });
  }
  const carousel = useCarouselBar(props, scroller);
  return (
    <div style={{ maxWidth: 500, maxHeight: 500 }}>
      <button onClick={() => updateItems("remove")}>Remove</button>
      <button onClick={() => updateItems("add")}>Add</button>
      <button {...carousel.prevButtonProps}>Prev</button>
      <button {...carousel.nextButtonProps}>Next</button>
      <div
        className="scrollContainer"
        ref={setScroller}
        {...carousel.scrollerProps}
      >
        {[...carousel.collection].map((i) => (
          <NewItem state={carousel} key={i.key} item={i} />
        ))}
      </div>
      <ul style={{ display: "flex" }}>
        {carousel.pages.map((page, index) => (
          <NewNavItem state={carousel} index={index} />
        ))}
      </ul>
    </div>
  );
}

function NewItem({ item, state }) {
  const { itemProps } = useCarouselItemBar({ item }, state);
  return (
    <div className="item" data-index={item.index} {...itemProps}>
      {item.rendered}
    </div>
  );
}

function NewNavItem({ index, state }) {
  const { navItemProps, isSelected } = useCarouselNavItemBar({ index }, state);
  return (
    <button
      {...navItemProps}
      style={{ background: isSelected ? "yellow" : undefined }}
    >
      {index + 1}
    </button>
  );
}

export function App() {
  return (
    <div>
      <New items={slides}>
        {(slide) => (
          <Item textValue={slide.id}>
            <SlideContent content={slide.id} />
          </Item>
        )}
      </New>
      {/* <Carousel items={slides} visibleItems={3}> */}
      {/*   {(slide) => ( */}
      {/*     <Item textValue={slide.id}> */}
      {/*       <SlideContent content={slide.id} /> */}
      {/*     </Item> */}
      {/*   )} */}
      {/* </Carousel> */}
      {/* <div */}
      {/*   data-orientation="horizontal" */}
      {/*   className="scrollContainer" */}
      {/*   style={{ gridAutoColumns: "calc(100% / 3)" }} */}
      {/* > */}
      {/*   {slides.map(({ id }, i) => ( */}
      {/*     <div */}
      {/*       key={id} */}
      {/*       className="item" */}
      {/*       style={{ */}
      {/*         scrollSnapAlign: */}
      {/*           i === 0 || i === 3 || i === 6 || i === 9 ? "start" : "", */}
      {/*       }} */}
      {/*     > */}
      {/*       <SlideContent content={id} /> */}
      {/*     </div> */}
      {/*   ))} */}
      {/* </div> */}
    </div>
  );
}
