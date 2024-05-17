import { ComponentPropsWithoutRef } from "react";
import a from "@/assets/images/1.webp";
import b from "@/assets/images/2.webp";
import c from "@/assets/images/3.webp";
import d from "@/assets/images/4.webp";
import e from "@/assets/images/5.webp";
import f from "@/assets/images/6.webp";
import g from "@/assets/images/7.webp";
import h from "@/assets/images/8.webp";
import i from "@/assets/images/9.webp";
import Image from "next/image";

import { css } from "@/styled-system/css";

const images = [a, b, c, d, e, f, g, h, i];

export function StockPhoto({
  index,
  ...props
}: { index: number } & Omit<
  ComponentPropsWithoutRef<typeof Image>,
  "src" | "alt"
>) {
  return (
    <Image
      placeholder="blur"
      width={900}
      height={600}
      {...props}
      src={images[index]}
      alt="stock photo"
      className={[
        css({ aspectRatio: "3 / 2", objectFit: "cover", size: "100%" }),
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
