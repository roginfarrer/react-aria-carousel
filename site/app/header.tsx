import { flex, grid, visuallyHidden } from "@/styled-system/patterns";
import { FaChevronDown } from "react-icons/fa6";

import { HeroCarousel } from "./HeroCarousel";
import { css } from "@/styled-system/css";

export function Header() {
  return (
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
          gap: { base: "5", md: "10" },
          alignSelf: "flex-end",
          textAlign: "center",
        })}
      >
        <h1
          className={css({
            textStyle: { md: "2xl" },
            fontWeight: "bold",
            fontVariantCaps: "all-small-caps",
            letterSpacing: "0.5px",
          })}
        >
          React Aria Carousel
        </h1>
        <p
          className={css({
            textStyle: { base: "5xl", md: "6xl" },
            fontWeight: "bold",
            textWrap: "balance",
          })}
        >
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
  );
}
