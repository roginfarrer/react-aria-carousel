import { useRef } from "react";
import { apiData, data } from "@/data";
import { prose } from "@/styled-system/recipes";

type Source = Awaited<ReturnType<typeof data.get>>;

function reduceData(components: any) {
  return components.reduce((acc, curr) => {
    curr.exportedTypes.forEach((type) => {
      if (acc[type.name]) return acc;
      acc[type.name] = type;
    });
    return acc;
  }, {});
}

export default async function Page() {
  const componentData = await apiData();

  let components = await data.all();

  components = reduceData(components);

  return (
    <div className={prose()}>
      {Object.values(components).map((component) => {
        if (component.name.startsWith("use")) {
          return <HookTable source={component} />;
        } else {
          return <ComponentTable source={component} />;
        }
      })}
    </div>
  );
}

function ComponentTable({ source }: { source: Source }) {
  const { types, name } = source;
  if (!types) return "what";
  return (
    <div>
      <h2>{name}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => {
            return type.properties.map((prop) => (
              <tr key={prop.description}>
                <td>{prop.name}</td>
                <td>{prop.description}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

function HookTable({ source }: { source: any }) {
  const defaultProps = useRef<Record<string, any> | undefined>();
  return (
    <div>
      <h2>{source.name}</h2>
      <p>{source.description}</p>
      <pre>
        <code>{`${source.name}(${source.types
          .map((arg) => {
            if (arg.defaultValue && !defaultProps.current) {
              defaultProps.current = getDefaultProps(arg);
            }
            return `${arg.name}: ${arg.text}`;
          })
          .join(", ")})`}</code>
      </pre>
    </div>
  );
}

function getDefaultProps(propsString: string): Record<string, any> {
  const values = propsString
    .split("\n")
    .map((line) => {
      const matches = /(^.*): (.*),/.exec(line);
      if (matches) {
        return [matches[1]?.trim(), matches[2]?.trim()];
      }
      return null;
    })
    .filter(Boolean);

  return Object.fromEntries(values as string[][]);
}
