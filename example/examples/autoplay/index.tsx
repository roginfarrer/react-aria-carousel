import { CodeDemo } from "@/components/CodeDemo";

import { Autoplay } from "./Autoplay";
import demoRaw from "./Autoplay?raw";
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
      <Autoplay />
    </CodeDemo>
  );
}
