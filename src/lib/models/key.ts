import mongoose from "mongoose";
import { IUser } from "./user";

export interface IKey {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  value: string;
  type: string;
  user: IUser;
}

export const keySchema = new mongoose.Schema<IKey>(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    value: {
      type: String,
      required: true,
    },

    type: {
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

export const Key =
  mongoose.models.Key || mongoose.model<IKey>("Key", keySchema);
