import type { MDXComponents } from "mdx/types";

import { CodeDemo } from "./components/CodeDemo";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // return { ...components, CodeDemo: (props) => <CodeDemo {...props} /> };
  return components;
}
