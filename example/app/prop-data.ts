export const useCarousel = [
  {
    name: `autoplay`,
    description:
      "If true, the carousel will scroll automatically when the user is not interacting with",
    defaultValue: `false`,
    type: "boolean",
  },
  {
    name: `autoplayInterval`,
    description:
      "Specifies the amount of time, in milliseconds, between each automatic scroll.                                                                        ",
    defaultValue: `5000`,
    type: "number",
  },
  {
    name: `mouseDragging`,
    description:
      "Controls whether the user can scroll by clicking and dragging with their mouse.                                                                      ",
    defaultValue: `false`,
    type: "boolean",
  },
  {
    name: `scrollPadding`,
    description:
      "The amount of padding to apply to the scroll area, allowing adjacent items to become partially visible.                                              ",
    defaultValue: "-",
    type: "string",
  },
  {
    name: `spaceBetweenItems`,
    description:
      "The gap between items.                                                                                                                               ",
    defaultValue: `'0px'`,
    type: "string",
  },
  {
    name: `itemsPerPage`,
    description:
      'Number of items visible in a page. Can be an integer to show each item with equal dimensions, or a floating point number to "peek" subsequent items. ',
    defaultValue: `1`,
    type: "number",
  },
  {
    name: `loop`,
    description:
      "Controls the pagination behavior at the beginning and end.                                                                                           ",
    defaultValue: `false`,
    type: "'infinite' | 'native' | false",
  },
  {
    name: `orientation`,
    description:
      "The carousel scroll direction                                                                                                                        ",
    defaultValue: `'horizontal'`,
    type: "'horizontal' | 'vertical'",
  },
  {
    name: `scollBy`,
    description:
      "Controls whether scrolling snaps and pagination progresses by item or page.                                                                          ",
    defaultValue: `'page'`,
    type: "'page' | 'item'",
  },
  {
    name: `initialPages`,
    description:
      "Define the organization of pages on first render. Useful to render navigation during SSR.                                                            ",
    defaultValue: `[]`,
    type: "number[][]",
  },
];

export const useCarouselItem = [
  {
    name: "item",
    description: "An item in the collection of carousel items.",
    defaultValue: "-",
    type: "Item<T>",
  },
];

export const useCarouselTab = [
  {
    name: "index",
    type: "number",
    description: "An index of a page in the carousel.",
    defaultValue: "-",
  },
  {
    name: "isSelected",
    type: "boolean",
    description:
      "Whether the page is the active, visible page of the carousel.",
    defaultValue: "-",
  },
];

export const Carousel = [
  ...useCarousel.filter((prop) => prop.name !== "children"),
  {
    name: "children",
    type: "ReactNode",
    defaultValue: "-",
    description: "The elements of the carousel.",
  },
];

export const CarouselButton = [
  {
    name: "dir",
    type: "'next' | 'prev'",
    defaultValue: "-",
    description: "Direction that the carousel should scroll when clicked.",
  },
];

export const CarouselScroller = [
  {
    name: "items",
    type: "Array<T>",
    defaultValue: "-",
    description: "The data with which each item should be derived.",
  },
  {
    name: "children",
    type: "ReactElement | ReactElement[] | ((item: T, index: number) => ReactElement)",
    defaultValue: "-",
    description: "The collection of carousel items.",
  },
];

export const CarouselTabs = [
  {
    name: "children",
    type: `(props: {
  isSelected: boolean; 
  index: number
}) => ReactNode`,
    defaultValue: "-",
    description: "Function that returns a CarouselTab",
  },
];

export const CarouselItem = [
  {
    name: "index",
    type: "number",
    defaultValue: "-",
    description: "The placement of the item in the carousel.",
  },
];

export const CarouselAutoplayControl = [
  {
    name: "children",
    type: "ReactNode | ((props: {autoplayUserPreference: boolean}) => ReactNode)",
    defaultValue: "-",
    description: "The content of the button.",
  },
];

const props = {
  CarouselAutoplayControl,
  useCarousel,
  useCarouselItem,
  useCarouselTab,
  Carousel,
  CarouselButton,
  CarouselScroller,
  CarouselTabs,
  CarouselItem,
};

export default props;
