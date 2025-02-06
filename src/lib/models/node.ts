import mongoose from "mongoose";
import { IVersion } from "./version";
import { IFlow } from "./flow";

export interface INode {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion;
  data: any;
  position: { x: number; y: number };
  type: "schema" | "agent" | "component";
  flow: IFlow;
}

export const nodeSchema = new mongoose.Schema<INode>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    flow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flow",
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["schema", "agent", "component"],
    },
    data: {
      type: Object,
      required: true,
    },
    position: {
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

export const Node =
  mongoose.models.Node || mongoose.model<INode>("Node", nodeSchema);
