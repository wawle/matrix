import mongoose from "mongoose";
import { IVersion, VersionType } from "./version";
import { Node as NodeType } from "reactflow";
import { IModelData } from "../types/xgo/models";
import { IAgentData } from "../types/xgo/agents";

export type INodeData = IModelData | IAgentData;

export type VersionNodeDataType = {
  [VersionType.MODEL]: IModelData;
  [VersionType.AGENT]: IAgentData;
  [VersionType.PAGE]: any;
  [VersionType.SCREEN]: any;
};

export type INode<T extends VersionType> = NodeType<VersionNodeDataType[T]> & {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: IVersion<VersionType>;
  type: VersionType;
  data: VersionNodeDataType[VersionType];
};

export const nodeSchema = new mongoose.Schema<INode<VersionType>>(
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
      enum: [
        VersionType.MODEL,
        VersionType.AGENT,
        VersionType.PAGE,
        VersionType.SCREEN,
      ],
      required: true,
    },
    className: {
      type: String,
      required: false,
    },
    selectable: {
      type: Boolean,
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
    resizing: {
      type: Boolean,
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
    extent: {
      type: String,
      required: false,
    },
    zIndex: {
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

export const Node =
  mongoose.models.Node ||
  mongoose.model<INode<VersionType>>("Node", nodeSchema);
