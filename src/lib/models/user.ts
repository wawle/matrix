import mongoose from "mongoose";
import { Hiring } from "./hiring";
import { Project } from "./project";
import { Session } from "./session";
import { Key } from "./key";

export interface IUser {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  fullname: string;
  email: string;
  password: string;
  photo: string;
  role: string;
}

export const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("contracts", {
  ref: Hiring,
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("projects", {
  ref: Project,
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("sessions", {
  ref: Session,
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("keys", {
  ref: Key,
  localField: "_id",
  foreignField: "user",
});

userSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    Hiring.deleteMany({ user: _id }),
    Project.deleteMany({ user: _id }),
    Session.deleteMany({ user: _id }),
    Key.deleteMany({ user: _id }),
  ]);
  next();
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
