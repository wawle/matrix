import mongoose from "mongoose";
import { Edge, IEdge } from "./edge";
import { INode, Node } from "./node";
import { IProject } from "./project";

export interface IVersion {
  id: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  is_active: boolean;
  project?: IProject;
  type: "model" | "agent" | "page" | "screen";
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
  mongoose.models.Version || mongoose.model<IVersion>("Version", versionSchema);
