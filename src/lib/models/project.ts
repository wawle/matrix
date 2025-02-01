import mongoose from "mongoose";
import { IUser } from "./user";
import { IVersion } from "./version";
import { Version } from "./version";

export interface IProject {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  user: IUser;
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

projectSchema.pre("deleteOne", async function (next) {
  const project = this.getQuery();
  await Version.deleteMany({ project: project });
  next();
});

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
