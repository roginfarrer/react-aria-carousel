import { flex } from "@/styled-system/patterns";

import { css } from "@/styled-system/css";

const routes = [
  { title: "Getting Started", slug: "main-content", level: 1 },
  { title: "Features", level: 2 },
  { title: "Installation", level: 2 },
  { title: "Usage", level: 2 },
  { title: "Anatomy", level: 3 },
  { title: "Multiple Items", level: 3 },
  { title: "Looping", level: 3 },
  { title: "Orientation", level: 3 },
  { title: "Mouse Dragging", level: 3 },
  { title: "Autoplay", level: 3 },
  { title: "Scroll Hints", level: 3 },
  { title: "Accessibility & Labeling", level: 2 },
  { title: "Hooks", level: 2 },
  { title: "API", level: 2 },
  { title: "Carousel", level: 3 },
  { title: "CarouselScroller", level: 3 },
  { title: "CarouselItem", level: 3 },
  { title: "CarouselButton", level: 3 },
  { title: "CarouselTabs", level: 3 },
  { title: "CarouselTab", level: 3 },
  { title: "useCarousel", level: 3 },
  { title: "useCarouselItem", level: 3 },
  { title: "useCarouselNavItem", level: 3 },
  { title: "Browser Support", level: 2 },
  { title: "Acknowledgements", level: 2 },
];

export function Sidebar() {
  return (
    <div>
      <h2
        className={css({
          letterSpacing: "0.5px",
          fontVariantCaps: "all-petite-caps",
          fontWeight: "bold",
          mb: "2",
          textStyle: "sm",
        })}
      >
        Table of Contents
      </h2>
      <nav
        className={flex({
          direction: "column",
          gap: "2",
          borderLeft: "2px solid {colors.prose.hrBorder}",
          pl: "4",
          color: "slate.11",
          textStyle: "sm",
        })}
      >
        {routes.map((route) => {
          const slug =
            route.slug ??
            route.title.toLowerCase().replaceAll("&", "").replaceAll(" ", "-");
          return (
            <a
              key={slug}
              href={`#${slug}`}
              data-level={route.level}
              className={css({
                '&[data-level="3"]': { ml: "3" },
                scrollBehavior: "smooth",
              })}
            >
              {route.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
