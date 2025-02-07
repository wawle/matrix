import mongoose from "mongoose";
import { IModel } from "./model";

export interface IField {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  label: string;
  type: string;
  model: IModel;
  validations?: {
    optionLabel?: string;
    unique?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    email?: boolean;
    phone?: boolean;
    number?: boolean;
    date?: boolean;
    regex?: string;
    custom?: string;
    options?: string[];
    minDate?: Date;
    maxDate?: Date;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    default?: any;
  };
}

export const fieldSchema = new mongoose.Schema<IField>(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "string",
        "number",
        "boolean",
        "date",
        "array",
        "object",
        "reference",
      ],
      required: true,
    },
    validations: {
      type: Object,
      required: false,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Field =
  mongoose.models.Field || mongoose.model<IField>("Field", fieldSchema);
