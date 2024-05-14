import * as React from "react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const format = ({
  code,
  lang,
  props,
}: HighlightedCodeProps) => `\`\`\`${lang} ${props}
${code}
\`\`\``;

export interface HighlightedCodeProps {
  code: string;
  lang: string;
  props?: string;
}
export async function HighlightedCode({
  code,
  lang,
  props,
}: HighlightedCodeProps) {
  const highlightedCode = await highlightCode(format({ code, lang, props }));
  return (
    <section
      dangerouslySetInnerHTML={{
        __html: highlightedCode,
      }}
    />
  );
}

async function highlightCode(code: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-light-default",
      defaultLang: "tsx",
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(code);

  return String(file);
}
