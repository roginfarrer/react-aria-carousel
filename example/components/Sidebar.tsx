import { flex } from "@/styled-system/patterns";

import { css } from "@/styled-system/css";

const routes = [
  { title: "Getting Started", slug: "getting-started" },
  { title: "API", slug: "api" },
];

export function Sidebar() {
  return (
    <div>
      <h2>Navigation</h2>
      <nav className={flex({ direction: "column", gap: "4" })}>
        {routes.map((route) => (
          <a key={route.slug} href={`/${route.slug}`}>
            {route.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
