import createMDX from "@next/mdx";
import { createMdxtsPlugin } from "mdxts/next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  cleanDistDir: true,
  ignoreBuildErrors: true,
  poweredByHeader: false,
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
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
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  // See Options section below.
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeSlug],
  },
});

const withMDXTS = createMdxtsPlugin({
  gitSource: "https://github.com/roginfarrer/carousel",
  theme: "github-light",
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
