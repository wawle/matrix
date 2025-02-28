import { IEdge } from "@/lib/models/edge";
import { IModel } from "@/lib/models/model";

export const model = {
  template: (name: string, props: any): string => {
    const { model, relations }: { model: IModel; relations: IEdge[] } = props;
    const relatedRelations = relations.filter(
      (rel) =>
        rel.data.relationType === "oneToMany" && rel.targetName === model.name
    );
    const fields = model.fields
      .map((field: any) => {
        if (field.type === "reference") {
          return `  
        ${field.name}: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "${field.name.charAt(0).toUpperCase() + field.name.slice(1)}",
          validations: ${JSON.stringify(field.validations)},
        }`;
        } else {
          return `  
        ${field.name}: {
          type: ${field.type.charAt(0).toUpperCase() + field.type.slice(1)},
          validations: ${JSON.stringify(field.validations)},
        }`;
        }
      })
      .join(",\n");

    const virtualRelationships = relatedRelations
      ?.filter((rel) => rel.data.relationType === "oneToMany")
      ?.map(
        (rel) => `
        ${model.name.toLowerCase()}Schema.virtual("${rel.sourceName.toLowerCase()}s", {
          ref: "${rel.sourceName}",
          localField: "_id",
          foreignField: "${rel.targetName.toLowerCase()}"
        });`
      )
      .join("\n");

    let imports = "";
    const interfaceFields = model.fields
      .map((field) => {
        const modelName =
          field.name.charAt(0).toUpperCase() + field.name.slice(1);
        if (field.type === "reference") {
          imports += `import { I${modelName} } from "./${field.name.toLowerCase()}";\n`;
          return `${field.name}: I${modelName}`;
        } else if (field.type === "array") {
          return `${field.name}: any[]`;
        } else if (field.type === "object") {
          return `${field.name}: any`;
        } else if (field.type === "date") {
          return `${field.name}: Date`;
        } else {
          return `${field.name}: ${field.type.toLowerCase()}`;
        }
      })
      .join(",\n");

    const relationalInterfaceFields = relatedRelations
      ?.map((rel) => {
        return `${rel.sourceName.toLowerCase()}s: I${rel.sourceName}[]`;
      })
      .join(",\n");

    imports =
      imports +
      relatedRelations
        ?.map((rel) => {
          return `import { I${
            rel.sourceName
          } } from "./${rel.sourceName.toLowerCase()}";`;
        })
        .join("\n");

    let modelStr = `
import mongoose from "mongoose";
${imports}

export interface I${model.name} {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  ${interfaceFields}
  ${relationalInterfaceFields}
}

export const ${model.name.toLowerCase()}Schema = new mongoose.Schema<I${
      model.name
    }>(
  {
${fields}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
${virtualRelationships || ""}

export const ${model.name} =
  mongoose.models.${model.name} || mongoose.model<I${model.name}>("${
      model.name
    }", ${model.name.toLowerCase()}Schema);
      `;

    return modelStr;
  },
};

const getValidationRules = (field: any) => {
  if (!field.validations?.length) return "";

  const rules = field.validations
    .map((validation: any) => {
      switch (validation.type) {
        case "min":
          return `    min: [${validation.params}, "${validation.message}"]`;
        case "max":
          return `    max: [${validation.params}, "${validation.message}"]`;
        case "minLength":
          return `    minlength: [${validation.params}, "${validation.message}"]`;
        case "maxLength":
          return `    maxlength: [${validation.params}, "${validation.message}"]`;
        case "pattern":
          return `    match: [/${validation.params}/, "${validation.message}"]`;
        case "email":
          return `    match: [/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, "${validation.message}"]`;
        case "url":
          return `    match: [/^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/, "${validation.message}"]`;
        case "enum":
          const values = validation.params
            .split(",")
            .map((v: string) => `"${v.trim()}"`)
            .join(", ");
          return `    enum: {
            values: [${values}],
            message: "${validation.message}"
          }`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(",\n");

  return rules ? `\n    validate: {\n${rules}\n    }` : "";
};
