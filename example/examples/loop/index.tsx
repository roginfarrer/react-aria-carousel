import { CodeDemo } from "@/components/CodeDemo";

import { Looping } from "./Looping";
import demoRaw from "./Looping?raw";
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
      <Looping />
    </CodeDemo>
  );
}
