import mongoose from "mongoose";
import { IVersion } from "./version";
import { Field, IField } from "./field";

export interface IModel {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  version?: IVersion;
  description?: string;
  fields?: IField[];
}

export const modelSchema = new mongoose.Schema<IModel>(
  {
    name: {
      type: String,
      required: true,
    },
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

modelSchema.virtual("fields", {
  ref: Field,
  localField: "_id",
  foreignField: "model",
});

modelSchema.pre("deleteOne", async function (next) {
  const model = this.getQuery();
  await Field.deleteMany({ model: model });
  next();
});

export const Model =
  mongoose.models.Model || mongoose.model<IModel>("Model", modelSchema);
