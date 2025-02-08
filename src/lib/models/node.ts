import mongoose from "mongoose";
import { IVersion } from "./version";
import { Node as NodeType } from "reactflow";

export interface INode<T> extends NodeType<T> {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion;
  type: "model" | "agent" | "page" | "screen";
  data: T;
}

export const nodeSchema = new mongoose.Schema<INode<any>>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      enum: ["model", "agent", "page", "screen"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Node =
  mongoose.models.Node || mongoose.model<INode<any>>("Node", nodeSchema);
