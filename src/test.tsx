import { useCarousel } from "./useCarousel2.js";
import { useCarouselItem } from "./useCarouselItem.js";
import { useCarouselState } from "./useCarouselState.js";

function Carousel(props) {
  const state = useCarouselState();
  const carousel = useCarousel(props, state);

  return (
    <div {...carousel.carouselProps}>
      <button {...carousel.prevButtonProps} />
      <div {...carousel.carouselScrollerProps}>{props.children}</div>
      <button {...carousel.nextButtonProps} />
    </div>
  );
}

function CarouselItem(props) {
  const { state } = props;
  const stuff = useCarouselItem(props, state);

  return <div {...stuff.carouselItemProps}></div>;
}
