import { CodeDemo } from "@/components/CodeDemo";

import { Translated } from "./Translated";
import demoRaw from "./Translated?raw";
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
      <Translated />
    </CodeDemo>
  );
}
