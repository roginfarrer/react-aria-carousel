"use client";

import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from ".";

/** Some info */
export function BasicDemo() {
  return (
    <Carousel className="basic-root">
      <div className="basic-buttons">
        <CarouselButton dir="prev" className="basic-button">
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className="basic-button">
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className="basic-scroller">
        <CarouselItem key="a">
          <Slide index={0} />
        </CarouselItem>
        <CarouselItem key="b">
          <Slide index={1} />
        </CarouselItem>
        <CarouselItem key="c">
          <Slide index={2} />
        </CarouselItem>
        <CarouselItem key="d">
          <Slide index={3} />
        </CarouselItem>
        <CarouselItem key="e">
          <Slide index={4} />
        </CarouselItem>
      </CarouselScroller>
      <CarouselTabs className="basic-tabs">
        {(item) => (
          <CarouselTab className="basic-tab" index={item.index}>
            {item.index + 1}
          </CarouselTab>
        )}
      </CarouselTabs>
    </Carousel>
  );
}

function Slide({ index }: { index: number }) {
  return (
    <div className="basic-item">
      <img src={`https://picsum.photos/1600/900?random=${index}`} alt="" />
    </div>
  );
}
