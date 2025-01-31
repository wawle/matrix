
import mongoose from "mongoose";
import { IAgent } from "./agent";
import { IUser } from "./user";


export interface ISession {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  agent: IAgent,
user: IUser
}

export const sessionSchema = new mongoose.Schema<ISession>(
  {
  
        agent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Agent",
          required: true,
        },
  
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
      