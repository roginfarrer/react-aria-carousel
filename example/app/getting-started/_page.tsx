import { allDocs, data } from "@/data";

import Text from "./text.mdx";
import { Wow } from "./Wow";

export default async function Page() {
  // const compData = await data.get(["aria-carousel", "src", "carousel"]);
  // const compData = await data.getExample(["aria-carousel", "src", "carousel"]);
  const doc = await allDocs.get(["docs", "getting-started"]);

  const example = await data.getExample([
    "aria-carousel",
    "src",
    "carousel",
    "basic-demo",
  ]);

  //   return <example.moduleExport />

  return (
    <>
      <Wow />
    </>
  );
}
