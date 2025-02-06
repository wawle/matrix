import mongoose from "mongoose";
import { Field, IField } from "./field";
import { IProject } from "./project";

export interface IModel {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  project: IProject;
  description?: string;
  fields: IField[];
}

export const modelSchema = new mongoose.Schema<IModel>(
  {
    name: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

modelSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Field.deleteMany({ model: _id });
  next();
});

modelSchema.pre("deleteMany", async function (next) {
  const { _id } = this.getQuery();
  await Field.deleteMany({ model: _id });
  next();
});

export const Model =
  mongoose.models.Model || mongoose.model<IModel>("Model", modelSchema);
