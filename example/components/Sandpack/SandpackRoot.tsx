/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import { Children } from "react";
import * as React from "react";
import { SandpackLogLevel } from "@codesandbox/sandpack-client";
import { Sandpack } from "@codesandbox/sandpack-react";

import libRaw from "../../../aria-carousel/sandpack-build?raw";
import { createFileMap } from "./createFileMap";
import stylesRaw from "./PrettyExampleStyles";

type SandpackProps = {
  children: React.ReactNode;
  autorun?: boolean;
};

const sandboxStyle = `
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}
`.trim();

function SandpackRoot(props: SandpackProps) {
  let { children, autorun = true } = props;
  const codeSnippets = Children.toArray(children) as React.ReactElement[];
  const files = createFileMap(codeSnippets);

  files["/src/styles.css"] = {
    code: [sandboxStyle, files["/src/styles.css"]?.code ?? ""].join("\n\n"),
    hidden: !files["/src/styles.css"]?.visible,
  };

  return (
    <div className="sandpack sandpack--playground w-full my-8" dir="ltr">
      <Sandpack
        template="vite-react-ts"
        files={{
          // "/node_modules/react/package.json": {
          //   hidden: true,
          //   code: JSON.stringify({ name: "react", main: "./index.js" }),
          // },
          // "/node_modules/react/index.js": {
          //   hidden: true,
          //   code: rawReact,
          // },
          "./styles.css": stylesRaw,
          "/node_modules/@rogin/aria-carousel/package.json": {
            hidden: true,
            code: JSON.stringify({
              name: "@rogin/aria-carousel",
              main: "./dist/index.cjs",
            }),
          },
          "/node_modules/@rogin/aria-carousel/dist/index.cjs": {
            hidden: true,
            code: libRaw,
          },
          ...files,
        }}
      />
    </div>
  );
}

export default SandpackRoot;
