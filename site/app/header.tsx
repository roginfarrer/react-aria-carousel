import { flex, grid, visuallyHidden } from "@/styled-system/patterns";
import { FaChevronDown } from "react-icons/fa6";
import { PiArrowUpRight } from "react-icons/pi";

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
        gridTemplateAreas: '"copy" "arrow"',
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto min-content",
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
      <div
        className={flex({
          gridArea: "copy",
          direction: "column",
          gap: { base: "8", md: "10" },
          alignSelf: "center",
          textAlign: "center",
        })}
      >
        <header
          className={flex({
            direction: "column",
            gap: { base: "5", md: "10" },
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
            alignSelf: "center",
            maxWidth: "300px",
            md: { alignSelf: "start" },
            justifySelf: "center",
            overflow: "hidden",
            direction: "column",
            gap: "12",
            align: "center",
          })}
        >
          <div
            className={css({
              transformStyle: "preserve-3d",
              transform: `
                perspective(1300px)
                rotateX(0deg)
                rotateY(45deg)
                rotateZ(-15deg)
                translateZ(0)`,
              paddingBlock: "10%",
              width: "200%",
              marginLeft: "75%",
              marginRight: "-5vw",
            })}
          >
            <HeroCarousel />
          </div>
          <button
            type="button"
            className={flex({
              p: "2",
              rounded: "lg",
              bg: "gray.800",
              color: "white",
              align: "center",
              gap: "2",
              transition: "background-color .2s ease",
              _hover: {
                bg: "gray.600",
              },
            })}
          >
            View on GitHub <PiArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}
