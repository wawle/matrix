import { IModel } from "@/lib/models/model";

export function schemaBuilder(model: IModel): string {
  const fields = [
    {
      name: "id",
      type: "string",
      validations: {
        required: false,
        default: "",
      },
    },
    ...model.fields,
  ].map((field) => {
    return {
      ...field,
      validations: field.validations || {},
    };
  });

  const schemaDefinition = fields
    .map((field) => {
      switch (field.type) {
        case "string":
          const strOpt = field.validations.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const strDefault =
            field.validations.default !== undefined
              ? `.default(${JSON.stringify(field.validations.default)})`
              : "";
          return `  ${field.name}: z.string()${strOpt}${strDefault}`;
        case "number":
          const numberOpt = field.validations.required ? "" : ".optional()";
          const numberDefault =
            field.validations.default !== undefined
              ? `.default(${Number(field.validations.default)})`
              : "";
          return `  ${field.name}: z.number()${numberOpt}${numberDefault}`;
        case "boolean":
          const booleanOpt = field.validations.required ? "" : ".optional()";
          const booleanDefault =
            field.validations.default !== undefined
              ? `.default(${Boolean(field.validations.default)})`
              : "";
          return `  ${field.name}: z.boolean()${booleanOpt}${booleanDefault}`;
        case "date":
          const dateOpt = field.validations.required ? "" : ".optional()";
          const dateDefault =
            field.validations.default !== undefined
              ? `.default(${new Date(field.validations.default)})`
              : "";
          return `  ${field.name}: z.date()${dateOpt}${dateDefault}`;
        case "array":
          const arrayOpt = field.validations.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const arrayDefault =
            field.validations.default !== undefined
              ? `.default(${JSON.stringify(field.validations.default)})`
              : "";
          return `  ${field.name}: z.array(z.any())${arrayOpt}${arrayDefault}`;
        case "object":
          const objectOpt = field.validations.required ? "" : ".optional()";
          const objectDefault =
            field.validations.default !== undefined
              ? `.default(${JSON.stringify(field.validations.default)})`
              : "";
          return `  ${field.name}: z.object({})${objectOpt}${objectDefault}`;
        case "reference":
          const referenceOpt = field.validations.required
            ? ".min(1, 'Required')"
            : ".optional()";
          const referenceDefault =
            field.validations.default !== undefined
              ? `.default(${JSON.stringify(field.validations.default)})`
              : "";
          return `  ${field.name}: z.string()${referenceOpt}${referenceDefault}`;
        default:
          throw new Error(`Unsupported field type: ${field.type}`);
      }
    })
    .join(",\n");

  return schemaDefinition;
}
