import { Sidebar } from "@/components/Sidebar";
import { flex, grid } from "@/styled-system/patterns";
import { FaChevronDown } from "react-icons/fa6";

import { prose } from "../styled-system/recipes/prose";
import { HeroCarousel } from "./HeroCarousel";
import Text from "./intro.mdx";
import { css } from "@/styled-system/css";

const SNAP = "🫰";
const GLOBE = "🌐";
const NAIL = "💅";

export default async function Home() {
  return (
    <div>
      <div
        className={grid({
          height: "100dvh",
          width: "90vw",
          margin: "0 auto",
          gridTemplateAreas: '"copy" "demo" "arrow"',
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr 1.2fr min-content",
          gap: "6",
          // alignContent: "center",
          // md: {
          //   alignContent: "center",
          //   gridTemplateColumns: "1fr",
          //   gridTemplateRows: "1fr min-content",
          //   // gridAutoFlow: "dense",
          // },
        })}
      >
        <header
          className={flex({
            gridArea: "copy",
            direction: "column",
            // justifyContent: "space-between",
            gap: "10",
            py: "4",
            alignSelf: "flex-end",
            // md: {
            //   alignSelf: "center",
            //   gridColumn: "1 / 3",
            //   gridRow: "1 / 1",
            // },
          })}
        >
          <h1
            className={css({
              textStyle: "2xl",
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
          {/* <ul */}
          {/*   className={flex({ */}
          {/*     textStyle: "xl", */}
          {/*     direction: "column", */}
          {/*     gap: "4", */}
          {/*     "& li": { */}
          {/*       display: "flex", */}
          {/*     }, */}
          {/*     "& li::before": { */}
          {/*       content: "attr(data-emoji)", */}
          {/*       display: "inline-block", */}
          {/*       marginRight: "3", */}
          {/*     }, */}
          {/*   })} */}
          {/* > */}
          {/*   <li data-emoji={GLOBE}>Top-tier accessibilty</li> */}
          {/*   <li data-emoji={SNAP}> */}
          {/*     Browser-native scroll snapping and smooth scrolling */}
          {/*   </li> */}
          {/*   <li data-emoji={NAIL}>Bring your own styles</li> */}
          {/* </ul> */}
        </header>
        <div
          className={css({
            gridArea: "demo",
            alignSelf: "center",
            // md: {
            //   gridRow: "1 / 1",
            //   gridColumn: "2 / -1",
            // },
          })}
        >
          <div
            className={css({
              md: { "--items-per-page": "2" },
            })}
          >
            <HeroCarousel />
          </div>
        </div>
        <div
          className={css({
            gridArea: "arrow",
            pb: "4",
            justifySelf: "center",
            // md: {
            //   gridRow: "2 / -1",
            //   gridColumn: "1 / -1",
            //   justifySelf: "center",
            // },
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
              className={css({
                color: "gray.8",
                size: "36px",
              })}
            />
          </a>
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
          id="#main-content"
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
              bg: "mint.3",
              color: "mint.11",
              borderRadius: "xs",
              px: "4px",
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
