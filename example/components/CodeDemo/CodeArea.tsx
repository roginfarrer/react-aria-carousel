"use client";

import { useRef, useState } from "react";
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
  const ref = useRef<HTMLElement | null>(null);
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded: isExpanded,
    collapsedHeight: collapsedHeight,
  });

  return (
    <div className={css({ pos: "relative" })}>
      <div
        {...getCollapseProps({ ref })}
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
        <Tabs>
          <TabList
            className={css({
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              overflowX: "auto",
            })}
            items={files}
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
          <Collection items={files}>
            {(file) => {
              return (
                <TabPanel key={file.title}>
                  <section dangerouslySetInnerHTML={{ __html: file.code }} />
                </TabPanel>
              );
            }}
          </Collection>
        </Tabs>
      </div>
      <button
        {...getToggleProps({
          onClick: () => {
            setExpanded((prev) => {
              if (prev && ref.current) {
                ref.current.scrollTo({ top: 0 });
              }
              return !prev;
            });
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
