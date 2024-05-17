import { CodeDemo } from "@/components/CodeDemo";

import { Basic } from "./Basic";
import demoRaw from "./Basic?raw";
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
      <Basic />
    </CodeDemo>
  );
}
