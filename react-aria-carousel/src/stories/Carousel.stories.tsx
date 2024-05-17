import { useMemo, useState } from "react";
import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Item } from "..";
import { CarouselItem, CarouselNavItem, Slide, useCarousel } from "./Carousel";
import { BasicExampleCarousel } from "./foo";

const Carousel = useCarousel;

const meta = {
  title: "Stories",
  component: useCarousel,
  subcomponents: {
    // @ts-expect-error not component
    useCarouselItem: CarouselItem,
    // @ts-expect-error not component
    useCarouselNavItem: CarouselNavItem,
  },
  parameters: {
    docs: {
      toc: { headingSelector: "h1, h2, h3" },
      controls: { exclude: ["aspectRatio"] },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    itemsPerPage: {
      control: { type: "number", min: 1 },
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "1" },
      },
    },
    orientation: {
      table: {
        type: {
          summary: "'horizontal' | 'vertical'",
        },
        defaultValue: { summary: "horizontal" },
      },
    },
    spaceBetweenItems: {
      type: "string",
      control: "text",
      table: { defaultValue: { summary: "0px" } },
    },
    scrollPadding: { type: "string", control: "text" },
    mouseDragging: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    scrollBy: {
      options: ["page", "item"],
      table: { type: { summary: "'page' | 'item'" } },
      defaultValue: { summary: "page" },
    },
    loop: {
      table: {
        type: { summary: "'infinite' | 'native' | false" },
        defaultValue: { summary: "false" },
      },
      options: ["infinite", "native", "false"],
      mapping: { infinite: "infinite", native: "native", false: false },
    },
    initialPages: {
      table: { defaultValue: { summary: "[]" } },
      control: false,
    },
    autoplay: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    autoplayInterval: {
      control: "number",
      table: { defaultValue: { summary: "5000" } },
    },
    children: {
      control: { disable: true },
      description:
        "The children of the scroller element. Should include elements created with `useCarouselItem`.",
    },
    items: {
      control: { disable: true },
      description:
        "The item objects for each carousel item, for dynamic collections.",
    },
  },
  args: {
    items: [
      { index: 0 },
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
    ],
    // @ts-expect-error storybook
    children: (item: { index: number }) => (
      <Item key={item.index}>
        <Slide index={item.index} />
      </Item>
    ),
    spaceBetweenItems: "16px",
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Playground: Story = {
  render(props) {
    const aspectRatio = (props.itemsPerPage || 1) > 1 ? "4 / 3" : "16 / 9";
    const spaceBetweenItems = props.spaceBetweenItems ?? "24px";
    const itemCount =
      !props.itemsPerPage ||
      Number.isNaN(props.itemsPerPage) ||
      props.itemsPerPage! < 0
        ? 1
        : props.itemsPerPage;
    return (
      <Carousel
        {...props}
        autoplay
        itemsPerPage={itemCount}
        aspectRatio={aspectRatio}
        spaceBetweenItems={spaceBetweenItems}
      >
        <Item key="0">
          <Slide index={0} />
        </Item>
        <Item key="1">
          <Slide index={1} />
        </Item>
        <Item key="2">
          <Slide index={2} />
        </Item>
        <Item key="3">
          <Slide index={3} />
        </Item>
        <Item key="4">
          <Slide index={4} />
        </Item>
        <Item key="5">
          <Slide index={5} />
        </Item>
      </Carousel>
    );
  },
};

export const MultipleItems: Story = {
  args: {
    itemsPerPage: 3,
    aspectRatio: "4 / 3",
    spaceBetweenItems: "16px",
  },
  render: function Render(props) {
    return (
      <Carousel {...props}>
        <Item key="0">
          <Slide index={0} />
        </Item>
        <Item key="1">
          <Slide index={1} />
        </Item>
        <Item key="2">
          <Slide index={2} />
        </Item>
        <Item key="3">
          <Slide index={3} />
        </Item>
        <Item key="4">
          <Slide index={4} />
        </Item>
        <Item key="5">
          <Slide index={5} />
        </Item>
      </Carousel>
    );
  },
};

export const RenderPropChildren: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render({ items: propItems, children, collection, ...props }) {
    const aspectRatio = (props.itemsPerPage || 1) > 1 ? "4 / 3" : "16 / 9";
    const spaceBetweenItems = props.spaceBetweenItems ?? "24px";
    const items = useMemo(
      () => [
        { index: 0 },
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 },
      ],
      [],
    );
    return (
      <Carousel
        {...props}
        spaceBetweenItems={spaceBetweenItems}
        aspectRatio={aspectRatio}
        items={items}
      >
        {(item: { index: number }) => (
          <Item key={item.index}>
            <Slide index={item.index} />
          </Item>
        )}
      </Carousel>
    );
  },
};

export const BasicExample: Story = {
  render() {
    return (
      <BasicExampleCarousel>
        <Item>1</Item>
        <Item>2</Item>
        <Item>3</Item>
        <Item>4</Item>
        <Item>5</Item>
        <Item>6</Item>
      </BasicExampleCarousel>
    );
  },
};

export const AddingAndRemoving: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render({ items: propItems, children, collection, ...props }) {
    const [items, setItems] = useState([
      { index: 0 },
      { index: 1 },
      { index: 2 },
    ]);
    const add = () => setItems((prev) => [...prev, { index: prev.length + 1 }]);
    const remove = () => setItems((prev) => prev.slice(0, items.length - 1));
    return (
      <div>
        <button onClick={add}>Add Item</button>
        <button onClick={remove}>Remove Item</button>
        <Carousel
          {...props}
          items={items}
          spaceBetweenItems="16px"
          aspectRatio="16 / 9"
        >
          {(item: { index: number }) => (
            <Item key={item.index}>
              <Slide index={item.index} />
            </Item>
          )}
        </Carousel>
      </div>
    );
  },
};

export const Autoplay: Story = {
  args: {
    spaceBetweenItems: "16px",
    aspectRatio: "16 / 9",
    autoplay: true,
    autoplayInterval: 5000,
  },
};

export const InfiniteLoop: Story = {
  args: {
    spaceBetweenItems: "16px",
    loop: "infinite",
  },
};

export const NativeLoop: Story = {
  args: {
    spaceBetweenItems: "16px",
    loop: "native",
  },
};

export const MouseDragging: Story = {
  args: {
    mouseDragging: true,
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    scrollPadding: "10%",
  },
};

export const Hint: Story = {
  args: {
    scrollPadding: "10%",
  },
};
