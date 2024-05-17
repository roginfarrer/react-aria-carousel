import { CodeDemo } from "@/components/CodeDemo";

import { Dynamic } from "./Dynamic";
import demoRaw from "./Dynamic?raw";
import stylesRaw from "!!raw-loader!./styles.module.css";

export default function Demo() {
  return (
    <CodeDemo
      files={[
        { code: demoRaw, title: "App.tsx", lang: "tsx" },
        {
          code: stylesRaw,
          title: "./styles.css",
          lang: "css",
        },
      ]}
    >
      <Dynamic />
    </CodeDemo>
  );
}
