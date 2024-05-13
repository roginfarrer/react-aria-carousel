import * as path from "node:path";

import { stuff } from "../data";
import { prose } from "../styled-system/recipes/prose";
import Text from "./intro.mdx";

export default async function Home() {
  const components = await stuff.tree();
  console.log(components);
  return (
    <div className={prose()}>
      <h1>test</h1>
    </div>
  );
}
