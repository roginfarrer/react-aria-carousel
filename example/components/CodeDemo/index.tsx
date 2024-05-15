import { ReactNode } from "react";

import { CodeArea } from "./CodeArea";
import { highlightCode } from "./highlightCode";
import { css } from "@/styled-system/css";

export async function CodeDemo({
  children,
  files,
}: {
  children: ReactNode;
  files: { code: string; title: string; lang: string }[];
}) {
  let transformedFiles = [];
  for (let file of files) {
    const arr = file.code.split("\n");
    if (arr[0].includes("use client")) {
      file.code = arr.slice(2, arr.length).join("\n");
    }
    const code = await highlightCode(file);
    transformedFiles.push({ ...file, code, id: file.title });
  }

  return (
    <div
      className={css({
        borderRadius: "lg",
        "--demo-border": "1px solid {colors.prose.hrBorder}",
        "--code-bg": "colors.prose.preBg",
        border: "var(--demo-border)",
        overflow: "hidden",
        maxWidth: "100%",
        _osDark: { "--demo-border": "1px solid {colors.indigo.3}" },
      })}
    >
      <div
        className={css({
          borderBottom: "var(--demo-border)",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: "4",
          sm: {
            p: "8",
          },
        })}
      >
        {children}
      </div>
      <div>
        <CodeArea collapsedHeight={200} files={transformedFiles} />
      </div>
    </div>
  );
}
