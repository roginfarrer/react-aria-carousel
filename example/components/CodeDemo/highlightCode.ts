import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export interface HighlightedCodeProps {
  code: string;
  lang: string;
  props?: string;
}

const format = ({
  code,
  lang,
  props,
}: HighlightedCodeProps) => `\`\`\`${lang} ${props}
${code}
\`\`\``;

export async function highlightCode({
  code,
  lang,
  props,
}: HighlightedCodeProps) {
  const formatted = format({ code, lang, props });
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-light",
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(formatted);

  return String(file);
}
