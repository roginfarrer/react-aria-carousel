"use client";

import { useState } from "react";
import { flex } from "@/styled-system/patterns";
import { useCollapse } from "react-collapsed";

import { css } from "@/styled-system/css";

export function Client({ children, collapsedHeight }) {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: isExpanded,
    collapsedHeight: collapsedHeight,
  });

  return (
    <div className={css({ pos: "relative" })}>
      <div
        {...getCollapseProps()}
        className={css({
          '&[aria-hidden="true"]::before': {
            content: "''",
            position: "absolute",
            inset: 0,
            borderRadius: "calc({radii.lg} - 1px)",
            backgroundImage:
              "linear-gradient(0deg,var(--code-bg) 10%,transparent 100%)",
            zIndex: 1,
          },
        })}
      >
        {children}
      </div>
      <button
        {...getToggleProps({
          onClick: () => {
            setExpanded((prev) => !prev);
          },
        })}
        className={css({
          color: "cyan.700",
          display: "block",
          textAlign: "center",
          py: "4",
          width: "100%",
          bg: "var(--code-bg)",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 2,
          borderRadius: "calc({radii.lg} - 1px)",
        })}
      >
        {isExpanded ? "Collapse code" : "Expand Code"}
      </button>
    </div>
  );
}
