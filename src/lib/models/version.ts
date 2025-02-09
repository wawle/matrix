import mongoose from "mongoose";
import { IProject } from "./project";
import slugify from "slugify";
import { Edge, IEdge } from "./edge";
import { INode, Node } from "./node";
import { ErrorResponse } from "../middlewares/error";

export enum VersionType {
  MODEL = "model", // api
  AGENT = "agent", // agent
  PAGE = "page", // web
  SCREEN = "screen", // app
}

export interface IVersion<T extends VersionType> {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  project?: IProject;
  type: T;
  slug: string;
  nodes: INode<T>[];
  edges: IEdge<T>[];
  handleNodes?: (nodes: INode<T>[]) => Promise<INode<T>[]>;
  handleEdges?: (edges: IEdge<T>[]) => Promise<IEdge<T>[]>;
  handleSlug?: () => Promise<void>;
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

versionSchema.methods.handleNodes = async function (
  nodes: INode<VersionType>[]
) {
  await Node.deleteMany({ version: this._id });
  const nodesWithVersion = nodes.map((node) => ({
    ...node,
    version: this._id,
  }));
  const createdNodes = await Node.insertMany(nodesWithVersion);
  return createdNodes;
};

versionSchema.methods.getNodeIdByEdge = async function (val: string) {
  // check if val is mongoose object id
  const node = await Node.findOne({ name: val });
  return node?.id;
};

versionSchema.methods.handleEdges = async function (
  edges: IEdge<VersionType>[]
) {
  await Edge.deleteMany({ version: this._id });
  const edgesWithVersion = await Promise.all(
    edges.map(async (edge) => ({
      ...edge,
      target: edge.target,
      source: edge.source,
      sourceNode: await this.getNodeIdByEdge(edge.source),
      targetNode: await this.getNodeIdByEdge(edge.target),
      version: this._id,
    }))
  );

  const createdEdges = await Edge.insertMany(edgesWithVersion);

  return createdEdges;
};

versionSchema.methods.handleSlug = async function () {
  this.slug = slugify(this.name, { lower: true });
  await this.save();
};

versionSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

versionSchema.pre("findOneAndUpdate", async function (next) {
  const body = this.getUpdate() as IVersion<VersionType>;
  const versionId = this.getQuery()._id as string;
  const version = await Version.findById(versionId);
  if (!version) {
    throw new ErrorResponse("Version bulunamadı", 404);
  }

  await version.handleNodes(body?.nodes);
  await version.handleEdges(body?.edges);
  await version.handleSlug();

  next();
});

versionSchema.virtual("nodes", {
  ref: "Node",
  localField: "_id",
  foreignField: "version",
});

versionSchema.virtual("edges", {
  ref: "Edge",
  localField: "_id",
  foreignField: "version",
});

export const Version =
  mongoose.models?.Version ||
  mongoose.model<IVersion<VersionType>>("Version", versionSchema);
