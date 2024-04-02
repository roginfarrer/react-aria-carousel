import React, {useMemo, useRef, useState} from 'react';
import {Stack, Wayfinders, CarouselButton, Box} from '@homebase/core';
import Carousel, {CarouselRef} from './Carousel';
import {Story} from '@storybook/react';
import Image from '../Image';

export default {
  title: 'Carousel',
  component: Carousel,
};

const SlideContent = ({content}: {content: number | string}) => {
  const color = useMemo(
    () => `hsla(${Math.floor(Math.random() * 360)}, 100%, 70%, 1)`,
    []
  );
  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 50,
      }}
    >
      {content}
    </div>
  );
};

export const Basic = () => {
  const [slides, setSlides] = useState(
    [...Array(10)].map((_, i) => ({id: `${i}`}))
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <button
        onClick={() => {
          setSlides((prev) => [...prev, {id: `${prev.length + 1}`}]);
        }}
      >
        Add slide
      </button>
      ActiveIndex: {activePageIndex}
      <Stack>
        <Carousel
          aria-label="Colors"
          onActivePageIndexChange={setActivePageIndex}
          items={slides}
        >
          <Carousel.Scroller>
            {(s: Slide) => (
              <Carousel.Item key={s.id}>
                <SlideContent content={s.id} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
        </Carousel>
      </Stack>
    </div>
  );
};

export const BasicVertical = () => {
  const [slides, setSlides] = useState(
    [...Array(10)].map((_, i) => ({id: `${i}`}))
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <button
        onClick={() => {
          setSlides((prev) => [...prev, {id: `${prev.length + 1}`}]);
        }}
      >
        Add slide
      </button>
      ActiveIndex: {activePageIndex}
      <Stack>
        <Carousel
          aria-label="Colors"
          maxHeight="500px"
          orientation="vertical"
          onActivePageIndexChange={setActivePageIndex}
          items={slides}
        >
          <Carousel.Scroller>
            {(s: Slide) => (
              <Carousel.Item key={s.id}>
                <SlideContent content={s.id} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
        </Carousel>
      </Stack>
    </div>
  );
};

export const Pagination = () => {
  const carousel = useRef<CarouselRef>();
  const slides = useMemo(
    () => [...Array(10)].map((_, i) => ({key: `${i}`})),
    []
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <Box position="relative">
        <Carousel
          aria-label="Colors"
          items={slides}
          ref={carousel}
          onActivePageIndexChange={setActivePageIndex}
        >
          <Carousel.PreviousButton>
            <CarouselButton isCentered direction="previous" />
          </Carousel.PreviousButton>
          <Carousel.NextButton>
            <CarouselButton isCentered direction="next" />
          </Carousel.NextButton>
          <Carousel.Scroller>
            {(slide: Slide) => (
              <Carousel.Item>
                <SlideContent content={slide.key} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
          <Carousel.Nav display="flex" gap="$1500">
            {(_, index) => (
              <Carousel.NavItem
                borderRadius="50vw"
                size="32px"
                bg={activePageIndex === index ? 'red' : 'blue'}
              />
            )}
          </Carousel.Nav>
        </Carousel>
      </Box>
    </div>
  );
};

export const Wayfinder = () => {
  const carousel = useRef<CarouselRef>();
  const slides = useMemo(
    () => [...Array(10)].map((_, i) => ({id: `${i}`})),
    []
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <Box position="relative">
        <Carousel
          aria-label="Colors"
          ref={carousel}
          onActivePageIndexChange={setActivePageIndex}
          items={slides}
        >
          <Carousel.PreviousButton>
            <CarouselButton isCentered direction="previous" />
          </Carousel.PreviousButton>
          <Carousel.NextButton>
            <CarouselButton isCentered direction="next" />
          </Carousel.NextButton>
          <Carousel.Scroller>
            {(slide: Slide) => (
              <Carousel.Item key={slide.id}>
                <SlideContent content={slide.id} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
        </Carousel>
      </Box>
      <Wayfinders childrenCount={slides.length} activeIndex={activePageIndex} />
    </div>
  );
};

export const Scrollbar = () => {
  const [activePageIndex, setActivePageIndex] = useState<number | undefined>();
  const slides = useMemo(
    () => [...Array(10)].map((_, i) => ({id: `${i}`})),
    []
  );
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <p>activePageIndex: {activePageIndex}</p>
      <Box position="relative">
        <Carousel
          aria-label="Colors"
          items={slides}
          onActivePageIndexChange={setActivePageIndex}
        >
          <Carousel.Scroller>
            {(slide: Slide) => (
              <Carousel.Item key={slide.id}>
                <SlideContent content={slide.id} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
          <Carousel.Scrollbar />
        </Carousel>
      </Box>
    </div>
  );
};

export const WayfinderInfiniteScrolling = () => {
  const carousel = useRef<CarouselRef>();
  const slides = useMemo(
    () => [...Array(10)].map((_, i) => ({id: `${i}`})),
    []
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  type Slide = typeof slides[number];
  return (
    <div style={{maxWidth: 900}}>
      <Box position="relative">
        <Carousel
          aria-label="colors"
          ref={carousel}
          items={slides}
          onActivePageIndexChange={setActivePageIndex}
          enableLoopPagination
        >
          <Carousel.PreviousButton>
            <CarouselButton isCentered direction="previous" />
          </Carousel.PreviousButton>
          <Carousel.NextButton>
            <CarouselButton isCentered direction="next" />
          </Carousel.NextButton>
          <Carousel.Scroller>
            {(s: Slide) => (
              <Carousel.Item key={s.id}>
                <SlideContent content={s.id} />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
        </Carousel>
      </Box>
      <Wayfinders childrenCount={slides.length} activeIndex={activePageIndex} />
    </div>
  );
};

const MultiItemTemplate: Story = (args) => {
  const carousel = useRef<CarouselRef>();
  const [activePageIndex, setActivePageIndex] = useState(0);

  const hasGap = args.hasGap;
  const visibleItems = args.visibleItems;
  const snapAnchor = args.snapAnchor;

  React.useLayoutEffect(() => {
    carousel.current?.refresh();
  }, [args.visibleItems]);

  const slides = useMemo(
    () => Array.from({length: 18}, (_, i) => ({id: `${i + 1}`})),
    []
  );

  type Slide = typeof slides[number];
  return (
    <Box bg="$neutral10" p="$2000">
      <Box position="relative" maxWidth={args.isVertical ? '300px' : ''}>
        <Carousel
          orientation={args.isVertical ? 'vertical' : 'horizontal'}
          scrollBy={args.snapAnchor}
          aria-label="Colors"
          maxHeight={args.isVertical ? '500px' : ''}
          ref={carousel}
          items={slides}
          snapAnchor={snapAnchor}
          onActivePageIndexChange={setActivePageIndex}
        >
          <Carousel.PreviousButton>
            <CarouselButton
              isCentered
              direction="previous"
              isVertical={args.isVertical}
            />
          </Carousel.PreviousButton>
          <Carousel.NextButton>
            <CarouselButton
              isCentered
              direction="next"
              isVertical={args.isVertical}
            />
          </Carousel.NextButton>
          <Carousel.Scroller
            spaceBetweenItems={hasGap ? '16px' : '0px'}
            visibleItems={visibleItems}
          >
            {(slide: Slide, index) => (
              <Carousel.Item
                {...(args.isVertical
                  ? {display: 'flex', justifyContent: 'center'}
                  : {})}
              >
                <div
                  style={{
                    width: args.isVertical ? '200px' : '100%',
                    height: args.isVertical ? '200px' : '500px',
                    backgroundColor: index % 2 ? 'blueviolet' : 'forestgreen',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 50,
                  }}
                >
                  {slide.id}
                </div>
              </Carousel.Item>
            )}
          </Carousel.Scroller>
        </Carousel>
        {activePageIndex}
      </Box>
    </Box>
  );
};

export const MultiItem = MultiItemTemplate.bind({});

MultiItem.args = {
  hasGap: true,
  visibleItems: 3,
  snapAnchor: 'item',
  isVertical: false,
};

export const MultiItemVertical = MultiItemTemplate.bind({});

MultiItemVertical.args = {
  ...MultiItem.args,
  isVertical: true,
};

const toilets = [
  'https://secure.img1-cg.wfcdn.com/im/26475600/resize-h800-w800%5Ecompr-r85/1239/123971569/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/08440638/resize-h800-w800%5Ecompr-r85/1736/173628444/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/73770208/resize-h800-w800%5Ecompr-r85/1904/190433861/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/96933283/resize-h800-w800%5Ecompr-r85/1736/173628438/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/63266658/resize-h800-w800%5Ecompr-r85/1355/135536680/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/89797241/resize-h800-w800%5Ecompr-r85/1355/135536652/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/74476455/resize-h800-w800%5Ecompr-r85/1239/123971483/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/74789631/resize-h800-w800%5Ecompr-r85/1355/135536690/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
  'https://secure.img1-cg.wfcdn.com/im/38646269/resize-h800-w800%5Ecompr-r85/1736/173628465/Swiss+Madison+St.+Tropez%C2%AE+1.6+Gallons+Per+Minute+GPF+Elongated+Floor+Mounted+One-Piece+Toilet+%28Seat+Included%29.jpg',
].map((url) => ({url}));
type Toilet = typeof toilets[number];

export const PDPCarousel = () => {
  const carouselNavRef = useRef<HTMLElement | null>(null);
  const carouselNavItemRefs = useRef(new Map<number, HTMLElement | null>());
  const carousel = useRef<CarouselRef>();

  function scrollNav(index: number) {
    if (!carouselNavRef.current) return;

    goToElement({
      scrollport: carouselNavRef.current,
      element: carouselNavItemRefs.current.get(index),
    });
  }

  return (
    <Box maxWidth="800px">
      <Box position="relative" mb="$2000">
        <Carousel
          aria-label="PDP"
          ref={carousel}
          items={toilets}
          getItemKey={(item) => item.url}
          enableLoopPagination
        >
          <Carousel.PreviousButton onClick={scrollNav}>
            <CarouselButton isCentered direction="previous" />
          </Carousel.PreviousButton>
          <Carousel.Scroller>
            {(item: Toilet) => (
              <Carousel.Item>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Image
                    src={item.url}
                    aspectRatio={{height: 800, width: 800}}
                    alt="toilet"
                  />
                </a>
              </Carousel.Item>
            )}
          </Carousel.Scroller>
          <Carousel.NextButton onClick={scrollNav}>
            <CarouselButton isCentered direction="next" />
          </Carousel.NextButton>
          <Box position="relative" px="100px">
            <Carousel.PreviousButton onClick={scrollNav}>
              <CarouselButton isCentered direction="previous" />
            </Carousel.PreviousButton>
            <Carousel.Nav
              ref={carouselNavRef}
              display="grid"
              gap="$1500"
              gridColumn="1/-1"
              gridAutoFlow="column"
              gridAutoColumns="max-content"
              overflow="hidden"
              scrollBehavior="smooth"
            >
              {(item: Toilet, i) => {
                return (
                  <Carousel.NavItem
                    ref={(node) => {
                      if (node) {
                        carouselNavItemRefs.current.set(i, node);
                      } else {
                        carouselNavItemRefs.current.delete(i);
                      }
                    }}
                  >
                    <Image
                      alt="toilet"
                      src={item.url}
                      aspectRatio={{height: 100, width: 100}}
                    />
                  </Carousel.NavItem>
                );
              }}
            </Carousel.Nav>
            <Carousel.NextButton onClick={scrollNav}>
              <CarouselButton isCentered direction="next" />
            </Carousel.NextButton>
          </Box>
        </Carousel>
      </Box>
    </Box>
  );
};

function goToElement({
  scrollport,
  element,
}: {
  scrollport?: HTMLElement | null;
  element?: HTMLElement | Element | null;
}) {
  if (
    !(scrollport instanceof HTMLElement) ||
    !(element instanceof HTMLElement)
  ) {
    return;
  }
  const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft);
  const scrollerPadding = parseInt(
    window.getComputedStyle(scrollport)['padding-left'],
    10
  );

  const pos =
    scrollport.clientWidth / 2 > delta
      ? delta - scrollerPadding
      : delta + scrollerPadding;

  if (
    pos >= scrollport.scrollLeft &&
    pos + element.clientWidth <= scrollport.scrollLeft + scrollport.clientWidth
  ) {
    return;
  }

  scrollport.scrollTo(pos, 0);
}
