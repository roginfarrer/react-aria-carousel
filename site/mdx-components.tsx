import type { MDXComponents } from "mdx/types";

import { css } from "./styled-system/css";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    table: (props) => (
      <div className={css({ overflowX: "auto" })}>
        <table {...props} />
      </div>
    ),
  };
}
