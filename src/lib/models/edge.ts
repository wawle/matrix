import mongoose from "mongoose";
import { IVersion, VersionType } from "./version";
import { Edge as EdgeType } from "reactflow";
import { IModelConnectionData } from "@/lib/types/xgo/models";
import { IAgentConnectionData } from "../types/xgo/agents";

export type IEdgeData = IModelConnectionData | IAgentConnectionData;

export type VersionEdgeDataType = {
  [VersionType.MODEL]: IModelConnectionData;
  [VersionType.AGENT]: IAgentConnectionData;
  [VersionType.PAGE]: any;
  [VersionType.SCREEN]: any;
};

export type IEdge<T extends VersionType> = EdgeType<VersionEdgeDataType[T]> & {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion<VersionType>;
  type: VersionType;
  data: VersionEdgeDataType[VersionType];
};

export const edgeSchema = new mongoose.Schema<IEdge<VersionType>>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    type: {
      type: String,
      enum: [
        VersionType.MODEL,
        VersionType.AGENT,
        VersionType.PAGE,
        VersionType.SCREEN,
      ],
      required: true,
    },
    data: {
      type: Object,
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
    label: {
      type: String,
      required: false,
    },
    animated: {
      type: Boolean,
      required: false,
      default: true,
    },
    className: {
      type: String,
      required: false,
    },
    sourceNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      required: false,
    },
    targetNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      required: false,
    },
    reconnectable: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Edge =
  mongoose.models.Edge ||
  mongoose.model<IEdge<VersionType>>("Edge", edgeSchema);
