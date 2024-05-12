"use client";

import React from "react";
import ReactDOM from "react-dom";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import * as Carousel from "use-carousel";

import styles from "./foo.css";
import { css } from "@/styled-system/css";

function cleanCode(moduleString: string) {
  let inImport = false;
  const mod = moduleString.split("\n");
  const trimmed = mod.map((line, index) => {
    if (line.trim().startsWith("import")) {
      if (!line.includes("from")) {
        inImport = true;
      }
      return null;
    }
    if (inImport) {
      if (line.includes("from")) {
        inImport = false;
      }
      return null;
    }
    if (line.startsWith("export")) {
      return line.replace(/export( default)? /, "");
    }
    return line;
  });
  const joined = trimmed.filter(Boolean).join("\n");
  return joined;
}

export function LiveDemo({ code }: { code: string }) {
  return (
    <div className={css({ border: "1px solid {colors.gray.300}" })}>
      <LiveProvider
        scope={{ ...Carousel, React, ...React, ReactDOM, ...ReactDOM, styles }}
        code={code}
        noInline
        enableTypeScript
        transformCode={(code) =>
          `${cleanCode(code)} render(<Fragment><Demo /></Fragment>)`
        }
        disabled
      >
        <LiveEditor
          className={css({
            fontFamily: "monospace",
            borderRadius: 0,
            fontSize: "sm",
          })}
        />
        <LiveError />
        <LivePreview className={css({ p: "6", bg: "gray.100" })} />
      </LiveProvider>
    </div>
  );
}
