import mongoose from "mongoose";
import { IVersion } from "./version";

export interface IEdge {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion;
  data: any;
  source: string;
  target: string;
  animated: boolean;
  label: string;
}

export const edgeSchema = new mongoose.Schema<IEdge>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    animated: {
      type: Boolean,
      required: false,
      default: true,
    },
    label: {
      type: String,
      required: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Edge =
  mongoose.models.Edge || mongoose.model<IEdge>("Edge", edgeSchema);
