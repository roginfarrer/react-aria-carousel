import { CodeDemo } from "@/components/CodeDemo";

import { MouseDragging } from "./MouseDragging";
import demoRaw from "./MouseDragging?raw";
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
      <MouseDragging />
    </CodeDemo>
  );
}
