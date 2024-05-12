import {
  Carousel,
  CarouselButton,
  CarouselItem,
  CarouselScroller,
  CarouselTab,
  CarouselTabs,
} from "use-carousel";

export default function Demo() {
  return (
    <Carousel className="root">
      <div className="buttons">
        <CarouselButton dir="prev" className="button">
          Previous
        </CarouselButton>
        <CarouselButton dir="next" className="button">
          Next
        </CarouselButton>
      </div>
      <CarouselScroller className="scroller">
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

function Slide({ index }: { index: number }) {
  return (
    <div className="item">
      <img src={`https://picsum.photos/1600/900?random=${index}`} alt="" />
    </div>
  );
}
