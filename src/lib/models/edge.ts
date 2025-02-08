import mongoose from "mongoose";
import { IVersion } from "./version";
import { IModelEdge } from "@/lib/types/xgo/models";
import { IAgentEdge } from "@/lib/types/xgo/agents";
import { Edge as EdgeType } from "reactflow";

export type TEdge = IModelEdge | IAgentEdge;

export type IEdge = EdgeType<TEdge> & {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion;
};

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
