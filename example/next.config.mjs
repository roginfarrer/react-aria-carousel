import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      loader: "raw-loader",
    });

    return config;
  },
};

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  // See Options section below.
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);