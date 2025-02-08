import mongoose from "mongoose";
import { IUser } from "./user";
import { IVersion, Version, VersionType } from "./version";
import slugify from "slugify";
import { ErrorResponse } from "../middlewares/error";

export interface IProject {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  user: IUser;
  slug: string;
  versions: IVersion<VersionType>[];
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
    slug: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.pre("findOneAndUpdate", async function (next) {
  const { name } = this.getQuery();
  this.findOneAndUpdate({ name }, { slug: slugify(name, { lower: true }) });
  next();
});

projectSchema.virtual("versions", {
  ref: Version,
  localField: "_id",
  foreignField: "project",
});

projectSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([Version.deleteMany({ project: _id })]);
  next();
});

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
