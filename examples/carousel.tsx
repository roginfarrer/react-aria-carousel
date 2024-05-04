import { useMemo } from "react";
import { useCarousel } from "../src/useCarousel.js";
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

export interface ItemProps {
  /**
   * The items of the carousel, by index, that the carousel should snap to.
   * Changes based on the number of slides in view.
   */
  readonly snapPointIndexes: Set<number>;
  /**
   * If 'item', the carousel will snap to each individual item when scrolling.
   * If 'page', the carousel will snap to each page when scrolling.
   */
  snapAnchor?: "item" | "page";
}

// function Item({ snapPointIndexes, snapAnchor, ...props }: ItemProps) {
//   return <div {...} />;
// }

const slides = [...Array(10)].map((_, i) => ({ id: `${i}` }));

export function Carousel({
  orientation,
}: {
  orientation?: "horizontal" | "vertical";
}) {
  const carousel = useCarousel({ orientation });

  return (
    <div onKeyDown={carousel.handleRootElKeydown} style={{ maxHeight: 500 }}>
      <div className="scrollContainer" {...carousel.getScrollerProps()}>
        {slides.map(({ id }, index) => (
          <div key={id} {...carousel.getItemProps({ index })} className="item">
            <SlideContent content={id} />
          </div>
        ))}
      </div>
    </div>
  );
}
