import mongoose from "mongoose";
import { IUser } from "./user";
import { IAgent } from "./agent";

export interface IHiring {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
  agent: IAgent;
}

export const hiringSchema = new mongoose.Schema<IHiring>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Hiring =
  mongoose.models.Hiring || mongoose.model<IHiring>("Hiring", hiringSchema);
