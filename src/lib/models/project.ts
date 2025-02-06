import mongoose, { Model } from "mongoose";
import { IUser } from "./user";
import { IVersion, Version } from "./version";
import { IModel } from "./model";
import { IPage, Page } from "./page";
import { IScreen, Screen } from "./screen";
import { Agent, IAgent } from "./agent";

export interface IProject {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  user: IUser;
  models: IModel[];
  agents: IAgent[];
  pages: IPage[];
  screens: IScreen[];
  versions: IVersion[];
}

export const projectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual("versions", {
  ref: Version,
  localField: "_id",
  foreignField: "project",
});

projectSchema.virtual("models", {
  ref: Model,
  localField: "_id",
  foreignField: "project",
});

projectSchema.virtual("agents", {
  ref: Agent,
  localField: "_id",
  foreignField: "project",
});

projectSchema.virtual("pages", {
  ref: Page,
  localField: "_id",
  foreignField: "project",
});

projectSchema.virtual("screens", {
  ref: Screen,
  localField: "_id",
  foreignField: "project",
});

projectSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    Version.deleteMany({ project: _id }),
    Model.deleteMany({ project: _id }),
    Agent.deleteMany({ project: _id }),
    Page.deleteMany({ project: _id }),
    Screen.deleteMany({ project: _id }),
  ]);
  next();
});

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
