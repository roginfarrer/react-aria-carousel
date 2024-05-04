import { Node, CollectionStateBase } from "@react-types/shared";

export interface CarouselProps<T extends object>
  extends CollectionStateBase<T> {
  /**
   * The direction of the carousel
   * @default 'horizontal'
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Describes the initial pagination of the carousel, useful for SSR k
   * @default []
   */
  initialPages?: number[][];
  /**
   * Handler called when the activePageIndex changes
   */
  onActivePageIndexChange?: (idx: number) => void;
  /**
   * If 'page', the carousel will scroll by the number of items in view.
   * If 'item', the carousel will scroll by each individual item.
   * @default 'page'
   */
  scrollBy?: "page" | "item";
  /** Handler called when the scroll position changes */
  onScrollPositionChange?: (pos: "start" | "middle" | "end") => void;
  /** @default false */
  enableLoopPagination?: boolean;
  text?: {
    singleItemAnnouncement?: (opts: {
      currentItem: number;
      itemCount: number;
    }) => string;
    multiItemAnnouncement?: (opts: {
      currentItem: number;
      itemCount: number;
      itemsPerPage: number;
    }) => string;
    itemAriaLabel?: (opts: {
      currentItem: number;
      itemCount: number;
    }) => string;
    itemAriaRoleDescription?: string;
  };
  visibleItems?: number;
  spaceBetweenItems?: string;
}
