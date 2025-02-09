import mongoose from "mongoose";
import { IModelData } from "../types/xgo/models";
import { IAgentData } from "../types/xgo/agents";
import { IVersion, VersionType } from "./version";
import { CoordinateExtent, XYPosition } from "reactflow";

export type NodeData = IModelData | IAgentData;

export type NodeDataType = {
  [VersionType.MODEL]: IModelData;
  [VersionType.AGENT]: IAgentData;
  [VersionType.PAGE]: any;
  [VersionType.SCREEN]: any;
};

export interface INode<T extends VersionType> {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  version?: IVersion<T>;
  data: NodeDataType[T];
  type: "model" | "agent" | "page" | "screen";
  position: {
    x: number;
    y: number;
  };
  className?: string;
  connectable?: boolean;
  width?: number;
  height?: number;
  parentId?: string;
  parentNode?: string;
  zIndex?: number;
  extent?: "parent" | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
}

export const nodeSchema = new mongoose.Schema<INode<VersionType>>(
  {
    version: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },
    name: {
      type: String,
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
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    className: {
      type: String,
      required: false,
    },
    connectable: {
      type: Boolean,
      required: false,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    parentId: {
      type: String,
      required: false,
    },
    parentNode: {
      type: String,
      required: false,
    },
    zIndex: {
      type: Number,
      required: false,
    },
    extent: {
      type: String,
      required: false,
    },
    expandParent: {
      type: Boolean,
      required: false,
    },
    positionAbsolute: {
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

export const Node =
  mongoose.models?.Node ||
  mongoose.model<INode<VersionType>>("Node", nodeSchema);
