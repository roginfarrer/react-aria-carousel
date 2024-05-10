import { ComponentPropsWithoutRef, useMemo } from "react";
import { Canvas, Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

import { Item } from "..";
import { Carousel, CarouselItem, CarouselNavItem, Slide } from "./Carousel";

const meta = {
  title: "Examples",
  component: Carousel,
  subcomponents: {
    useCarouselItem: CarouselItem,
    useCarouselNavItem: CarouselNavItem,
  },
  parameters: {
    docs: {
      toc: true,
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
    spaceBetweenSlides: {
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
      // control: "select",
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
      table: { defaultValue: { summary: "3000" } },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  render(props) {
    const aspectRatio = (props.itemsPerPage || 1) > 1 ? "4 / 3" : "16 / 9";
    const spaceBetweenItems = props.spaceBetweenSlides ?? "24px";
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
        spaceBetweenSlides={spaceBetweenItems}
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
    spaceBetweenSlides: "16px",
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
  render(props) {
    const aspectRatio = (props.itemsPerPage || 1) > 1 ? "4 / 3" : "16 / 9";
    const spaceBetweenItems = props.spaceBetweenSlides ?? "24px";
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
        spaceBetweenSlides={spaceBetweenItems}
        aspectRatio={aspectRatio}
        items={items}
      >
        {(item) => (
          <Item key={item.index}>
            <Slide index={item.index} />
          </Item>
        )}
      </Carousel>
    );
  },
};

// export const MultipleItems: Story = {
//   args: {
//     itemsPerPage: 3,
//     itemCount: 12,
//     spaceBetweenSlides: "16px",
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
