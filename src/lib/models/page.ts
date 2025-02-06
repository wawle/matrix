import mongoose from "mongoose";
import { IProject } from "./project";

export interface IPage {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  project?: IProject;
  description?: string;
  props: any;
}

export const pageSchema = new mongoose.Schema<IPage>(
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

export const Page =
  mongoose.models.Page || mongoose.model<IPage>("Page", pageSchema);
