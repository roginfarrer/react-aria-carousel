import { ReactNode } from "react";

import { HighlightedCodeProps } from "./ClientHighlightedCode";
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
  for (const file of files) {
    const code = await highlightCode(file);
    transformedFiles.push({ ...file, code, id: file.title });
  }

  return (
    <div
      className={css({
        borderRadius: "lg",
        "--demo-border": "1px solid {colors.gray.300}",
        "--code-bg": "colors.gray.50",
        border: "var(--demo-border)",
        overflow: "hidden",
      })}
    >
      <div
        className={css({
          borderBottom: "1px solid {colors.gray.300}",
          p: "8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        {children}
      </div>
      <div>
        <CodeArea collapsedHeight={300} files={transformedFiles} />
      </div>
    </div>
  );
}
