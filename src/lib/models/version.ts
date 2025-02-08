import mongoose from "mongoose";
import { IProject } from "./project";
import { IModelData, IModelEdgeData } from "../types/xgo/models";
import { IAgentData, IAgentEdgeData } from "../types/xgo/agents";
import { IPageData } from "../types/xgo/pages";
import { Edge, Node } from "reactflow";
import slugify from "slugify";
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
  [VersionType.MODEL]: IModelEdgeData;
  [VersionType.AGENT]: IAgentEdgeData;
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
  project?: IProject;
  type: VersionType;
  slug: string;
  nodes: Node<VersionNodeDataType[T]>[];
  edges: Edge<VersionEdgeDataType[T]>[];
}

export const versionSchema = new mongoose.Schema<IVersion<VersionType>>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
      default: "",
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
    nodes: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
    },
    edges: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

versionSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

versionSchema.pre("findOneAndUpdate", async function (next) {
  const { name } = this.getQuery();
  this.findOneAndUpdate({ name }, { slug: slugify(name, { lower: true }) });
  next();
});

export const Version =
  mongoose.models?.Version ||
  mongoose.model<IVersion<VersionType>>("Version", versionSchema);
