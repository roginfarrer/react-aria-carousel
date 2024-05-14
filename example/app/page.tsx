import { prose } from "../styled-system/recipes/prose";
import Text from "./intro.mdx";
import { css } from "@/styled-system/css";

export default async function Home() {
  return (
    <div className={`${prose({ size: "lg" })} `}>
      <Text />
    </div>
  );
}
