import { CodeDemo } from "@/components/CodeDemo";

import { Orientation } from "./Orientation";
import demoRaw from "./Orientation?raw";
import stylesRaw from "!!raw-loader!./styles.module.css";

export default function Demo() {
  return (
    <CodeDemo
      files={[
        { code: demoRaw, title: "App.tsx", lang: "tsx" },
        {
          code: stylesRaw,
          title: "./styles.module.css",
          lang: "css",
        },
      ]}
    >
      <Orientation />
    </CodeDemo>
  );
}
