"use client";

import React, { useState } from "react";
import * as Carousel from "@rogin/aria-carousel";
import ReactDOM from "react-dom";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

import styles from "./LiveEditor.css";
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
        transformCode={(code) => `${cleanCode(code)} render(<Demo />)`}
        disabled
      >
        <LivePreview className={css({ p: "6", bg: "gray.100" })} />
        <CollapsedEditor />
        <LiveError />
      </LiveProvider>
    </div>
  );
}

function CollapsedEditor() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <div
        className={css({
          maxHeight: collapsed ? "300px" : "auto",
          overflow: "auto",
        })}
      >
        <LiveEditor
          className={css({
            fontFamily: "monospace",
            borderRadius: 0,
            fontSize: "sm",
          })}
        />
      </div>
      <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
        {collapsed ? "Show more" : "Collapse"}
      </button>
    </div>
  );
}
