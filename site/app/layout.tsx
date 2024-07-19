import type { Metadata } from "next";

import "./styles.css";
import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-mono";

import { css } from "@/styled-system/css";

export const metadata: Metadata = {
  title: "React Aria Carousel",
  description: "The carousel for the modern age",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={css({
          mb: "10",
          "& [data-carousel-scroller]": { scrollbar: "hidden" },
        })}
      >
        {children}
      </body>
    </html>
  );
}
