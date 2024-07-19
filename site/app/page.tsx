import { Sidebar } from "@/components/Sidebar";
import { flex } from "@/styled-system/patterns";

import { prose } from "../styled-system/recipes/prose";
import { Header } from "./header";
import Text from "./intro.mdx";
import { css } from "@/styled-system/css";

export default async function Home() {
  return (
    <div>
      <Header />
      <div
        className={flex({
          width: "90vw",
          margin: "0 auto",
          justify: "center",
          pos: "relative",
          align: "flex-start",
          direction: "row-reverse",
          gap: "10",
        })}
      >
        <div
          className={css({
            position: "sticky",
            top: "10",
            width: 200,
            hideBelow: "md",
          })}
        >
          <Sidebar />
        </div>
        <main
          id="main-content"
          className={`${prose({ size: "lg" })} ${css({
            overflow: "auto",
            "& :where(pre,figure)": { overflow: "auto" },
            "& h3::after": {
              mt: "1",
              display: "block",
              content: "''",
              height: "3px",
              width: "100%",
              bg: "currentColor",
              borderRadius: "full",
            },
            "& :where(code)": {
              fontWeight: "normal",
              bg: "amber.3",
              color: "amber.11",
              borderRadius: "xs",
              px: "4px",
            },
            "& :where(a):has(code)": {
              textDecorationColor: "amber.11",
            },
            "& pre code": { bg: "transparent" },
            "& code::before,& code::after": { content: "initial" },
          })}`}
        >
          <Text />
        </main>
      </div>
    </div>
  );
}
