import { Sidebar } from "@/components/Sidebar";
import { flex, grid } from "@/styled-system/patterns";

import { Demo as Autoplay } from "../examples/Autoplay";
// import { Carousel, Composed, Slide } from "../examples/PrettyComponentExample";
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
          pt: "10",
          gridTemplateAreas: '"demo" "copy"',
          gridTemplateColumns: "1fr",
          gridTemplateRows: "min-content 1fr",
          gap: "8",
          overflow: "auto",
          // alignContent: "center",
          md: {
            alignContent: "center",
            gridTemplateAreas: '"copy demo"',
            gridTemplateColumns: "1.33fr 1fr",
            gridTemplateRows: "min-content",
          },
        })}
      >
        <header
          className={flex({
            gridArea: "copy",
            direction: "column",
            // justifyContent: "space-between",
            gap: "10",
            py: "4",
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
          <ul
            className={flex({
              textStyle: "xl",
              direction: "column",
              gap: "4",
              "& li": {
                display: "flex",
              },
              "& li::before": {
                content: "attr(data-emoji)",
                display: "inline-block",
                marginRight: "3",
              },
            })}
          >
            <li data-emoji={GLOBE}>Top-tier accessibilty</li>
            <li data-emoji={SNAP}>
              Browser-native scroll snapping and smooth scrolling
            </li>
            <li data-emoji={NAIL}>Bring your own styles</li>
          </ul>
        </header>
        <div className={css({ gridArea: "demo" })}>
          <div
            className={css({
              // transform: "rotate3d(-1, 2, 1, 36deg)",
              md: {
                width: "70dvw",
                pos: "absolute",
                left: 0,
              },
            })}
          >
            <HeroCarousel />
          </div>
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
            "& code": { fontWeight: "normal" },
            "& code::before,& code::after": { content: "initial" },
          })}`}
        >
          <Text />
        </div>
      </div>
    </div>
  );
}
