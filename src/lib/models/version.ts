import mongoose from "mongoose";
import { Edge, IEdge } from "./edge";
import { INode, Node } from "./node";
import { IProject } from "./project";
import { IModelConnectionType, IModelData } from "../types/xgo/models";
import { IAgentConnectionType, IAgentData } from "../types/xgo/agents";
import { IPageData } from "../types/xgo/pages";

export enum VersionType {
  MODEL = "model", // api
  AGENT = "agent", // agent
  PAGE = "page", // web
  SCREEN = "screen", // app
}

export type VersionNodeDataType = {
  [VersionType.MODEL]: IModelData;
  [VersionType.AGENT]: IAgentData;
  [VersionType.PAGE]: IPageData;
  [VersionType.SCREEN]: any; // IScreenData tipini import edip buraya ekleyebilirsiniz
};

export type VersionEdgeDataType = {
  [VersionType.MODEL]: IModelConnectionType;
  [VersionType.AGENT]: IAgentConnectionType;
  [VersionType.PAGE]: any;
  [VersionType.SCREEN]: any;
};

export interface IVersion<T extends VersionType> {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  is_active: boolean;
  project?: IProject;
  type: T;
  nodes: INode<VersionNodeDataType[T]>[];
  edges: IEdge<VersionEdgeDataType[T]>[];
}

export const versionSchema = new mongoose.Schema<IVersion<any>>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["model", "agent", "page", "screen"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

versionSchema.virtual("nodes", {
  ref: Node,
  localField: "_id",
  foreignField: "version",
});

versionSchema.virtual("edges", {
  ref: Edge,
  localField: "_id",
  foreignField: "version",
});

versionSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    Node.deleteMany({ version: _id }),
    Edge.deleteMany({ version: _id }),
  ]);
  next();
});

export const Version =
  mongoose.models.Version ||
  mongoose.model<IVersion<any>>("Version", versionSchema);
