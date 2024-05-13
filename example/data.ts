import { createSource } from "mdxts";

export const stuff = createSource("../src/**/*.(ts|tsx)", {
  baseDirectory: "../src",
  basePathname: "",
});
