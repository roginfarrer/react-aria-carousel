"use client";

import { useEffect, useRef, useState } from "react";
import {
  Collection,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";
import { useCollapse } from "react-collapsed";

import { css } from "@/styled-system/css";

export function CodeArea({
  files,
  collapsedHeight,
}: {
  files: { code: string; title: string; lang: string }[];
  collapsedHeight: number;
  filename?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: isExpanded,
    collapsedHeight: collapsedHeight,
    onTransitionStateChange(state) {
      if (state === "collapsing" && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
  });

  return (
    <div className={css({ pos: "relative" })}>
      <Tabs>
        <TabList
          className={css({
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            overflowX: "auto",
          })}
          items={files}
          ref={ref}
        >
          {(file) => (
            <Tab
              key={file.title}
              className={css({
                cursor: "default",
                color: "prose.body",
                flexShrink: 1,
                bg: "bodyBg",
                py: "1",
                px: "2",
                fontFamily: "mono",
                fontSize: "xs",
                borderRight: "var(--demo-border)",
                borderBottom: "var(--demo-border)",
                '&[aria-selected="true"]': {
                  fontWeight: "bold",
                },
              })}
            >
              {file.title}
            </Tab>
          )}
        </TabList>
        <div
          {...getCollapseProps()}
          className={css({
            fontSize: "1rem",
            "& figure": { margin: 0 },
            "& h2": { margin: 0 },
            "& pre": {
              bg: "var(--code-bg)",
              px: "4",
              py: "10",
              borderRadius: 0,
              whiteSpace: "pre-wrap",
            },
            // Adds the shadow gradient
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
          <Collection items={files}>
            {(file) => {
              return (
                <TabPanel key={file.title}>
                  <section dangerouslySetInnerHTML={{ __html: file.code }} />
                </TabPanel>
              );
            }}
          </Collection>
        </div>
      </Tabs>
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
          py: "3",
          width: "100%",
          bg: "var(--code-bg)",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 2,
          borderRadius: "calc({radii.lg} - 1px)",
          fontSize: "sm",
        })}
      >
        {isExpanded ? "Collapse code" : "Expand Code"}
      </button>
    </div>
  );
}
