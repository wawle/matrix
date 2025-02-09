import mongoose from "mongoose";
import { IModelEdgeData } from "../types/xgo/models";
import { IAgentEdgeData } from "../types/xgo/agents";
import { IVersion, VersionType } from "./version";
import { CSSProperties } from "react";
import { INode } from "./node";

export type EdgeData = IModelEdgeData | IAgentEdgeData;

export type EdgeDataType = {
  [VersionType.MODEL]: IModelEdgeData;
  [VersionType.AGENT]: IAgentEdgeData;
  [VersionType.PAGE]: any;
  [VersionType.SCREEN]: any;
};

export interface IEdge<T extends VersionType> {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion<T>;
  data: EdgeDataType[T];
  type: "model" | "agent" | "page" | "screen";
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  style?: CSSProperties;
  animated?: boolean;
  className?: string;
  sourceNode?: INode<T>;
  targetNode?: INode<T>;
  interactionWidth?: number;
  label?: string;
}

export const edgeSchema = new mongoose.Schema<IEdge<VersionType>>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["model", "agent", "page", "screen"],
      default: "model",
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
    sourceHandle: {
      type: String,
      required: false,
    },
    targetHandle: {
      type: String,
      required: false,
    },
    style: {
      type: Object,
      required: false,
    },
    animated: {
      type: Boolean,
      required: false,
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
    interactionWidth: {
      type: Number,
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
  mongoose.models?.Edge ||
  mongoose.model<IEdge<VersionType>>("Edge", edgeSchema);
