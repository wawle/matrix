import mongoose from "mongoose";
import { IProject } from "./project";

export interface IScreen {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  project?: IProject;
  description?: string;
  props: any;
}

export const screenSchema = new mongoose.Schema<IScreen>(
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
    props: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Screen =
  mongoose.models.Screen || mongoose.model<IScreen>("Screen", screenSchema);
