import { ComponentPropsWithoutRef, Fragment, ReactNode } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";
import {
  CarouselNavItemOptions,
  useCarouselNavItem,
} from "./useCarouselNavItem";

export interface CarouselTabsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: (props: { isSelected: boolean; index: number }) => ReactNode;
}

export function CarouselTabs({ children, ...props }: CarouselTabsProps) {
  const { carouselState } = useCarouselContext();

  return (
    <div {...mergeProps(carouselState?.navProps, props)}>
      {carouselState?.pages.map((_, index) => (
        <Fragment key={index}>
          {children({
            isSelected: index === carouselState?.activePageIndex,
            index,
          })}
        </Fragment>
      ))}
    </div>
  );
}

export interface CarouselTabProps
  extends CarouselNavItemOptions,
    ComponentPropsWithoutRef<"button"> {}

export function CarouselTab(props: CarouselTabProps) {
  const { carouselState } = useCarouselContext();
  const { index } = props;
  const { navItemProps } = useCarouselNavItem({ index }, carouselState!);
  return <button type="button" {...mergeProps(navItemProps, props)} />;
}
