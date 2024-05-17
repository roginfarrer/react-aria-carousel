import { createSource } from "mdxts";

export const allDocs = createSource("docs/**/*.mdx");

export const data = createSource("../aria-carousel/src/**/*.(ts|tsx)", {
  baseDirectory: "..",
  outputDirectory: ["dist"],
});

export const apiData = async () => {
  let allData = await data.all();
  type SourceData = (typeof allData)[number];
  let dedupedData = allData.reduce<Record<string, SourceData>>((acc, curr) => {
    curr.exportedTypes.forEach((type) => {
      if (acc[type.name]) return acc;
      acc[type.name] = type;
    });
    return acc;
  }, {});

  let structuredData: {
    hooks: Record<string, SourceData>;
    components: Record<string, SourceData>;
  } = { hooks: {}, components: {} };

  type HookData = {
    name: string;
    description?: string | null;
    arguments: SourceData["exportedTypes"];
  };

  type ComponentData = {
    name: string;
    description?: string | null;
    arguments: SourceData["exportedTypes"];
  };

  for (let [name, source] of Object.entries(dedupedData)) {
    if (source.isComponent) {
      structuredData.components[name] = source;
    } else {
      structuredData.hooks[name] = source;
    }
  }

  return structuredData;
};
