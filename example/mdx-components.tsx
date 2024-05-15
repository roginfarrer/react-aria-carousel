import { ElementType, forwardRef, ReactNode, RefObject } from "react";
import type { MDXComponents } from "mdx/types";

import { css } from "./styled-system/css";

function slugify(str: string) {
  return str.toLowerCase().replaceAll(" ", "-");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    table: (props) => (
      <div className={css({ overflowX: "auto" })}>
        <table {...props} />
      </div>
    ),
    // h1: (props) => <Heading as="h1" {...props} />,
    // h2: (props) => <Heading as="h2" {...props} />,
    // h3: (props) => <Heading as="h3" {...props} />,
    // h4: (props) => <Heading as="h4" {...props} />,
    // h5: (props) => <Heading as="h5" {...props} />,
    // h6: (props) => <Heading as="h6" {...props} />,
  };
}

const Heading = forwardRef(function Heading(
  { as: Element, children, ...rest }: { as: ElementType; children: ReactNode },
  ref: RefObject<HTMLHeadingElement>,
) {
  return (
    <Element id={`${slugify(children)}`} ref={ref} {...rest}>
      {children}
    </Element>
  );
});
