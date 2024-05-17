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

const images = [a, b, c, d, e, f, g, h, i];

export function StockPhoto({ index }: { index: number }) {
  return (
    <Image
      src={images[index]}
      placeholder="blur"
      alt="stock photo"
      width={900}
      height={600}
      style={{
        aspectRatio: "3 / 2",
        objectFit: "cover",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
