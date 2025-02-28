import mongoose from "mongoose";
import { IProject } from "./project";
import { IModel, Model } from "./model";
import { Edge, IEdge } from "./edge";
import { INode, Node } from "./node";

export interface IVersion {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  project?: IProject;
  is_active: boolean;
  models: IModel[];
  nodes: INode[];
  edges: IEdge[];
}

export const versionSchema = new mongoose.Schema<IVersion>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    is_active: {
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

versionSchema.virtual("models", {
  ref: Model,
  localField: "_id",
  foreignField: "version",
});

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
    Model.deleteMany({ version: _id }),
    Node.deleteMany({ version: _id }),
    Edge.deleteMany({ version: _id }),
  ]);
  next();
});

export const Version =
  mongoose.models.Version || mongoose.model<IVersion>("Version", versionSchema);
