import { Sidebar } from "@/components/Sidebar";
import { flex, grid, visuallyHidden } from "@/styled-system/patterns";
import { FaChevronDown } from "react-icons/fa6";

import { prose } from "../styled-system/recipes/prose";
import { HeroCarousel } from "./HeroCarousel";
import Text from "./intro.mdx";
import { css } from "@/styled-system/css";

export default async function Home() {
  return (
    <div>
      <div
        className={grid({
          maxWidth: "900px",
          height: "100vh",
          width: "90vw",
          margin: "0 auto",
          gridTemplateAreas: '"copy" "demo" "arrow"',
          gridTemplateColumns: "1fr",
          gridTemplateRows: ".8fr auto min-content",
          md: {
            gridTemplateRows: ".8fr 1.2fr min-content",
          },
          gap: "6",
        })}
      >
        <div
          className={css({
            gridArea: "arrow",
            py: "4",
            justifySelf: "center",
          })}
        >
          <a
            href="#main-content"
            className={css({
              display: "block",
              m: "0 auto",
              animation: "1s ease 0s infinite normal none running bounce",
            })}
          >
            <FaChevronDown
              aria-hidden="true"
              className={css({
                color: "gray.8",
                size: "36px",
              })}
            />
            <span className={visuallyHidden()}>Skip to content</span>
          </a>
        </div>
        <header
          className={flex({
            gridArea: "copy",
            direction: "column",
            gap: "10",
            py: "4",
            alignSelf: "flex-end",
          })}
        >
          <h1
            className={css({
              textStyle: { base: "xl", md: "2xl" },
              fontWeight: "bold",
              fontVariantCaps: "all-small-caps",
              letterSpacing: "0.5px",
            })}
          >
            React Aria Carousel
          </h1>
          <p className={css({ textStyle: "6xl", fontWeight: "bold" })}>
            The carousel for the modern age.
          </p>
        </header>
        <div
          className={css({
            gridArea: "demo",
            alignSelf: "center",
            maxWidth: "500px",
            md: { alignSelf: "start" },
            justifySelf: "center",
            overflow: "hidden",
            py: "2",
          })}
        >
          <HeroCarousel />
        </div>
      </div>
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
        <div
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
        </div>
      </div>
    </div>
  );
}
