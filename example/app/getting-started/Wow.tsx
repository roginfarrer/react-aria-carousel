import { CodeBlock } from "mdxts/components";

import BasicExample from "../../examples/BasicExample";

import "../../examples/BasicExample.css";

import { token } from "@/styled-system/tokens";

import raw from "../../examples/BasicExample?raw";
import { Client } from "./Client";
import rawCss from "!!raw-loader!../../examples/BasicExample.css";
import { css } from "@/styled-system/css";

export function Wow() {
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
        <BasicExample />
      </div>
      <div>
        <Client collapsedHeight={300}>
          <StyledCodeBlock value={raw} language="tsx" filename="App.tsx" />
        </Client>
      </div>
    </div>
  );
}

function StyledCodeBlock(props) {
  return (
    <div className={css({ pos: "relative" })}>
      <h2
        className={css({
          bg: "white",
          py: "1",
          px: "2",
          fontWeight: "bold",
          fontFamily: "mono",
          fontSize: "sm",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          borderRight: "var(--demo-border)",
          borderBottom: "var(--demo-border)",
        })}
      >
        {props.filename}
      </h2>
      <CodeBlock
        {...props}
        style={{
          container: {
            fontSize: token.var("fontSizes.sm"),
            padding: `${token.var("spacing.10")} ${token.var("spacing.4")} ${token.var("spacing.4")}`,
            borderRadius: 0,
            backgroundColor: "var(--code-bg)",
          },
        }}
        showToolbar={false}
      />
    </div>
  );
}
