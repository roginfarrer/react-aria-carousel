import { ExportedTypes } from "mdxts/components";

export function Types() {
  return (
    <ExportedTypes source="../../aria-carousel/src/Carousel.tsx">
      {(declarations) =>
        declarations.map((declaration) => (
          <div key={declaration.name}>
            <h2>{declaration.name}</h2>
            <p>{declaration.description}</p>
            {declaration.types.length ? (
              <ul>
                {declaration.types[0].properties.map(
                  (type) =>
                    (
                      <li key={type.name}>
                        <h3>{type.name}</h3>
                        <p>{type.description}</p>
                      </li>
                    ),
                )}
              </ul>
            ) : null}
          </div>
        ))
      }
    </ExportedTypes>
  );
}
