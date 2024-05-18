import type { Metadata } from "next";

import "./styles.css";
import "@/styled-system/styles.css";
import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-mono";
import "smoothscroll-polyfill";

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
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
