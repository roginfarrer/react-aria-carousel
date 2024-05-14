"use client";

import { useState } from "react";
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
  filename,
}: {
  files: { code: string; title: string; lang: string }[];
  collapsedHeight: number;
  filename?: string;
}) {
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
          maxHeight: "90dvh",
          overflowY: "auto",
          fontSize: "sm",
          "& figure": { margin: 0 },
          "& h2": { margin: 0 },
          "& pre": {
            bg: "var(--code-bg)",
            padding: "4",
            pt: "10",
            borderRadius: 0,
          },
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
                  flexShrink: 1,
                  bg: "white",
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

function FileTab() {
  return (
    <h2
      className={css({
        bg: "white",
        py: "1",
        px: "2",
        fontWeight: "bold",
        fontFamily: "mono",
        fontSize: "sm",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        borderRight: "var(--demo-border)",
        borderBottom: "var(--demo-border)",
      })}
    >
      {children}
    </h2>
  );
}
