import { useCallback } from "react";
import { useCollection } from "@react-stately/collections";
import { ListCollection } from "@react-stately/list";
import { CollectionStateBase, Node } from "@react-types/shared";

function useCarouselCollection<T extends object>(
  props: CollectionStateBase<T>,
) {
  let factory = useCallback(
    (nodes: Iterable<Node<T>>) => new ListCollection(nodes),
    [],
  );
  const collection = useCollection(props, factory, {
    suppressTextValueWarning: true,
  });

  return collection;
}

export { useCarouselCollection as useCollection };
