"use client";

import { ComponentPropsWithoutRef, Fragment, ReactNode } from "react";
import { mergeProps } from "@react-aria/utils";

import { useCarouselContext } from "./context";
import { CarouselTabOptions, useCarouselTab } from "./useCarouselTab";

export interface CarouselTabsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Function that returns a CarouselTab. */
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
  extends CarouselTabOptions,
    ComponentPropsWithoutRef<"button"> {}

export function CarouselTab(props: CarouselTabProps) {
  const { carouselState } = useCarouselContext();
  const { index } = props;
  const { navItemProps } = useCarouselTab({ index }, carouselState!);
  return <button type="button" {...mergeProps(navItemProps, props)} />;
}
