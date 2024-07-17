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
        px: "5vw",
        height: "100vh",
        pt: "8",
        margin: "0 auto",
        gridTemplateAreas: '"copy" "arrow"',
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr min-content",
        gap: "6",
      })}
    >
      <div
        className={flex({
          direction: "column-reverse",
          gap: "4",
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
      <div
        className={flex({
          gridArea: "copy",
          direction: "column",
          gap: { base: "8", md: "10" },
          // alignSelf: "center",
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
              textStyle: { base: "4xl", sm: "5xl", md: "6xl" },
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
            pos: "relative",
            flexGrow: 1,
            md: { alignSelf: "start" },
            direction: "column",
            gap: "24",
            align: "center",
            transform: `
                perspective(1300px)
                rotateX(0deg)
                rotateY(42deg)
                rotateZ(-12deg)
                translateZ(0)`,
            transformStyle: "preserve-3d",
          })}
        >
          <div
            className={css({
              pos: "absolute",
              left: "-50%",
              right: "-50%",
              // translate: "5% 0",
              // width: "300%",
              isolation: "isolate",
            })}
          >
            <HeroCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
