import { ReactElement } from "react";
import { Item } from "@react-stately/collections";
import { type ItemProps } from "@react-types/shared";

type ItemType = <T extends object>(props: ItemProps<T>) => ReactElement;

const WrappedItem = Item as ItemType;

export { WrappedItem as Item };
