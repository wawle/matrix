import { ISchema } from "@/lib/types/xgo/models";

export function schemaBuilder(schemas: ISchema[]): string {
  const fields = [
    {
      name: "id",
      type: "string",
      required: false,
      default: "",
    },
    ...schemas,
  ];

  const schemaDefinition = fields
    .map((field) => {
      switch (field.type) {
        case "string":
          const strOpt = field.required ? ".min(1, 'Required')" : ".optional()";
          const strDefault =
            field.default !== undefined
              ? `.default(${JSON.stringify(field.default)})`
              : "";
          return `  ${field.name}: z.string()${strOpt}${strDefault}`;
        case "number":
          const numberOpt = field.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const numberDefault =
            field.default !== undefined
              ? `.default(${Number(field.default)})`
              : "";
          return `  ${field.name}: z.number()${numberOpt}${numberDefault}`;
        case "boolean":
          const booleanOpt = field.required ? "" : ".optional()";
          const booleanDefault =
            field.default !== undefined
              ? `.default(${Boolean(field.default)})`
              : "";
          return `  ${field.name}: z.boolean()${booleanOpt}${booleanDefault}`;
        case "date":
          const dateOpt = field.required ? "" : ".optional()";
          const dateDefault =
            field.default !== undefined
              ? `.default(${new Date(field.default)})`
              : "";
          return `  ${field.name}: z.date()${dateOpt}${dateDefault}`;
        case "array":
          const arrayOpt = field.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const arrayDefault =
            field.default !== undefined
              ? `.default(${JSON.stringify(field.default)})`
              : "";
          return `  ${field.name}: z.array(z.any())${arrayOpt}${arrayDefault}`;
        case "object":
          const objectOpt = field.required ? "" : ".optional()";
          const objectDefault =
            field.default !== undefined
              ? `.default(${JSON.stringify(field.default)})`
              : "";
          return `  ${field.name}: z.object({})${objectOpt}${objectDefault}`;
        case "reference":
          const referenceOpt = field.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const referenceDefault =
            field.default !== undefined
              ? `.default(${JSON.stringify(field.default)})`
              : "";
          return `  ${field.name}: z.string()${referenceOpt}${referenceDefault}`;
        default:
          throw new Error(`Unsupported field type: ${field.type}`);
      }
    })
    .join(",\n");

  return schemaDefinition;
}
