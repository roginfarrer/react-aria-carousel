import { css } from "@/styled-system/css";

export function PropTable({
  data,
}: {
  data: {
    name: string;
    description: string;
    defaultValue: string;
    type: string;
  }[];
}) {
  return (
    <table
      className={css({
        "& td": { textWrap: "pretty" },
        smDown: {
          "& thead": { display: "none" },
          "& tbody": {
            display: "flex",
            flexDirection: "column",
            gap: "5",
            maxWidth: "100%",
            overflow: "auto",
          },
          "& tr": {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            pb: "5",
            overflow: "auto",
          },
          "& td": {
            display: "block",
            textAlign: "left",
            padding: 0,
            maxWidth: "100%",
          },
          "& td::before": {
            textAlign: "left",
            display: "inline-block",
            content: "attr(data-column)",
            fontWeight: "bold",
            width: "80px",
          },
        },
      })}
    >
      <thead>
        <tr className={css({ "& th": { textAlign: "left" } })}>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {data.map((prop) => (
          <tr key={prop.name}>
            <td data-column="Name">
              <code>{prop.name}</code>
            </td>
            <td data-column="Type">
              <code>{prop.type}</code>
            </td>
            <td data-column="Default">
              <code>{prop.defaultValue}</code>
            </td>
            <td
              data-column="Description"
              className={css({
                fontSize: "sm",
                "&::before": { display: "none!" },
              })}
            >
              {prop.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
