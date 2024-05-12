"use client";

import { prose } from "../styled-system/recipes/prose";
import Text from "./intro.mdx";

export default function Home() {
  return (
    <div className={prose()}>
      <Text />
    </div>
  );
}
