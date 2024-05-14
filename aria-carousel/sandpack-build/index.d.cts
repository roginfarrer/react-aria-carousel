import { ElementType, ComponentPropsWithoutRef, Dispatch, SetStateAction, ReactElement, ReactNode } from 'react';
import { CollectionStateBase, Collection, Node, ItemProps, CollectionChildren } from '@react-types/shared';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface CarouselStateProps<T extends object> extends CollectionStateBase<T> {
    /**
     * Number of items visible on a page. Can be an integer to
     * show each item with equal dimensions, or a floating point
     * number to "peek" subsequent items.
     * @default 1
     */
    itemsPerPage?: number;
    /**
     * Controls the pagination behavior at the beginning and end.
     * "infinite" - will seamlessly loop to the other end of the carousel.
     * "native" - will scroll to the other end of the carousel.
     * false - will not advance beyond the first and last items.
     * @default false
     */
    loop?: "infinite" | "native" | false;
    /**
     * The carousel scroll direction.
     * @default 'horizontal'
     */
    orientation?: "vertical" | "horizontal";
    /**
     * Controls whether scrolling snaps and pagination progresses by item or page.
     * @default 'page'
     */
    scrollBy?: "page" | "item";
    /**
     * Define the organization of pages on first render.
     * Useful to render navigation during SSR.
     * @default []
     */
    initialPages?: number[][];
}
interface CarouselState<T extends object> extends Required<Pick<CarouselStateProps<T>, "itemsPerPage" | "scrollBy">> {
    /** The collection of items in the carousel. */
    readonly collection: Collection<Node<T>>;
    /** The index of the page in view. */
    readonly activePageIndex: number;
    /** The indexes of all items organized into arrays. */
    readonly pages: number[][];
    /** Scrolls the carousel to the next page. */
    next: () => number;
    /** Scrolls the carousel to the previous page. */
    prev: () => number;
    /** Scrolls the carousel to the provided page index. */
    scrollToPage: (index: number) => void;
}

type Attributes<T extends ElementType> = ComponentPropsWithoutRef<T> & Partial<Record<`data-${string}`, string | number | boolean>> & {
    inert?: string;
};

interface CarouselOptions<T extends object> extends CarouselStateProps<T> {
    /**
     * The gap between items.
     * @defaultValue '0px'
     */
    spaceBetweenItems?: string;
    /**
     * The amount of padding to apply to the scroll area, allowing adjacent items
     * to become partially visible.
     */
    scrollPadding?: string;
    /**
     * Controls whether the user can scroll by clicking and dragging with their mouse.
     * @default false
     */
    mouseDragging?: boolean;
    /**
     * If true, the carousel will scroll automatically when the user is not interacting with it.
     * @default false
     */
    autoplay?: boolean;
    /**
     * Specifies the amount of time, in milliseconds, between each automatic scroll.
     * @default 5000
     */
    autoplayInterval?: number;
}
interface CarouselAria<T extends object> extends CarouselState<T> {
    /** Props for the navlist element */
    readonly navProps: Attributes<"div">;
    /** Props for the root element */
    readonly rootProps: Attributes<"div">;
    /** Props for the previous button element */
    readonly prevButtonProps: Attributes<"button">;
    /** Props for the next button element */
    readonly nextButtonProps: Attributes<"button">;
    /** Props for the scroller element */
    readonly scrollerProps: Attributes<"div">;
    readonly autoplayControlProps: Attributes<"button">;
}
declare function useCarousel<T extends object>(props?: CarouselOptions<T>): [Dispatch<SetStateAction<HTMLElement | null>>, CarouselAria<T>];

interface CarouselNavItemOptions {
    /** An index of a page in the carousel. */
    index: number;
    /** Whether the page is the active, visible page of the carousel. */
    isSelected?: boolean;
}
interface CarouselNavItemAria extends Readonly<Required<Pick<CarouselNavItemOptions, "isSelected">>> {
    /** Props for the nav item element. */
    readonly navItemProps: Attributes<"button">;
}
declare function useCarouselNavItem<T extends object>(props: CarouselNavItemOptions, state: CarouselAria<T>): CarouselNavItemAria;

interface CarouselItemOptions<T extends object> {
    /** An item in the collection of carousel items */
    item: Node<T>;
}
interface CarouselItemAria {
    /** Props for the item element */
    readonly itemProps: Attributes<"div">;
}
declare function useCarouselItem<T extends object>(props: CarouselItemOptions<T>, state: CarouselAria<T>): CarouselItemAria;

type ItemType = <T extends object>(props: ItemProps<T>) => ReactElement;
declare const WrappedItem: ItemType;

interface CarouselProps<T extends object> extends Omit<CarouselOptions<T>, "children">, ComponentPropsWithoutRef<"div"> {
}
declare function Carousel<T extends object>({ children, spaceBetweenItems, scrollPadding, mouseDragging, autoplay, autoplayInterval, itemsPerPage, loop, orientation, scrollBy, initialPages, ...props }: CarouselProps<T>): react_jsx_runtime.JSX.Element;

interface CarouselTabsProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    children: (props: {
        isSelected: boolean;
        index: number;
    }) => ReactNode;
}
declare function CarouselTabs({ children, ...props }: CarouselTabsProps): react_jsx_runtime.JSX.Element;
interface CarouselTabProps extends CarouselNavItemOptions, ComponentPropsWithoutRef<"button"> {
}
declare function CarouselTab(props: CarouselTabProps): react_jsx_runtime.JSX.Element;

interface CarouselButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "dir"> {
    dir: "next" | "prev";
}
declare function CarouselButton({ dir, ...props }: CarouselButtonProps): react_jsx_runtime.JSX.Element;

interface CarouselScrollerProps<T extends object> extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    children: CollectionChildren<T>;
}
declare function CarouselScroller<T extends object>(props: CarouselScrollerProps<T>): react_jsx_runtime.JSX.Element;

interface CarouselAutoplayControlProps extends ComponentPropsWithoutRef<"button"> {
}
declare function CarouselAutoplayControl(props: CarouselAutoplayControlProps): react_jsx_runtime.JSX.Element;

export { Carousel, type CarouselAria, CarouselAutoplayControl, type CarouselAutoplayControlProps, CarouselButton, type CarouselButtonProps, WrappedItem as CarouselItem, type CarouselItemAria, type CarouselItemOptions, type CarouselNavItemOptions, type CarouselOptions, type CarouselProps, CarouselScroller, type CarouselScrollerProps, CarouselTab, type CarouselTabProps, CarouselTabs, type CarouselTabsProps, WrappedItem as Item, useCarousel, useCarouselItem, useCarouselNavItem };
