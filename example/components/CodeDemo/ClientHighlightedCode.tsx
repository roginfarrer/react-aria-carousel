import * as React from "react";

import { highlightCode } from "./highlightCode";

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
  const [formattedCode, setCode] = React.useState("");

  React.useEffect(() => {
    highlightCode(format({ code, lang, props })).then((highlightedCode) => {
      setCode(highlightedCode);
    });
  }, [code, lang, props]);

  return (
    <section
      dangerouslySetInnerHTML={{
        __html: formattedCode,
      }}
    />
  );
}
