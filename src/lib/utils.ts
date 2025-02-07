import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Schema } from "mongoose";
import { z } from "zod";
import { IVersion } from "./models/version";
import { IField } from "./models/field";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mapping Mongoose types to Zod types
const mongooseTypeToZod = (type: any): any => {
  switch (type) {
    case String:
      return z.string();
    case Number:
      return z.number();
    case Boolean:
      return z.boolean();
    case Date:
      return z.date();
    case Array:
      return z.array(z.any()); // You can customize this further
    case Object:
      return z.object({});
    default:
      return z.any();
  }
};

// Convert Mongoose Schema to Zod Schema
export const convertMongooseSchemaToZod = (mongooseSchema: Schema) => {
  const zodShape: any = {};

  for (const [key, value] of Object.entries(mongooseSchema.obj)) {
    const { type, required, default: defaultValue } = value as any;

    let zodType = mongooseTypeToZod(type);

    if (required) {
      zodType = zodType.required();
    } else {
      zodType = zodType.optional();
    }

    if (defaultValue !== undefined) {
      zodType = zodType.default(defaultValue);
    }

    zodShape[key] = zodType;
  }

  return z.object(zodShape);
};

export function convertTemplateToVersion(
  template: IVersion,
  versionId: string
): {
  models: {
    name: string;
    description: string;
    fields: {
      name: string;
      type: string;
      label: string;
      validations: any;
    }[];
  }[];
  nodes: any[];
  edges: any[];
} {
  return {
    models: template.nodes.map((node) => ({
      name: node.data.name,
      description: node.data.description,
      fields: node.data.fields.map((field: IField) => ({
        name: field.name,
        type: field.type,
        label: field.label,
        validations: field?.validations || {},
      })),
    })),
    nodes: template.nodes,
    edges: template.edges,
  };
}
