import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Schema } from "mongoose";
import { z } from "zod";

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
