import { flex, grid, visuallyHidden } from "@/styled-system/patterns";
import { FaChevronDown } from "react-icons/fa6";
import { PiArrowUpRight } from "react-icons/pi";

import { HeroCarousel } from "./HeroCarousel";
import { css } from "@/styled-system/css";

export function Header() {
  return (
    <div
      className={grid({
        py: { base: "4", sm: "8" },
        height: "100vh",
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
        className={flex({
          direction: "column-reverse",
          gridArea: "arrow",
          align: "center",
        })}
      >
        <div
          className={css({
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
      </div>
      <header
        className={flex({
          width: "90vw",
          margin: "0 auto",
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
        className={flex({
          gridArea: "demo",
          gap: "8",
          direction: "column",
          alignSelf: "center",
          maxWidth: "500px",
          md: { alignSelf: "start" },
          justifySelf: "center",
          overflow: "hidden",
          py: "2",
          align: "center",
        })}
      >
        <HeroCarousel />
        <button
          type="button"
          className={flex({
            textStyle: { base: "sm", sm: "md" },
            rounded: "lg",
            align: "center",
            p: { base: "2", md: "4" },
            bg: { base: "slate.700", _osDark: "slate.600" },
            color: "white",
            transition: "all 0.2s ease",
            _hover: {
              bg: "slate.500",
            },
          })}
        >
          View on GitHub <PiArrowUpRight />
        </button>
      </div>
    </div>
  );
}
