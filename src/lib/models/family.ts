
import mongoose from "mongoose";
import { IAgent } from "./agent";
import { IParent } from "./parent";


export interface IFamily {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  agent: IAgent,
parent: IParent
}

export const familySchema = new mongoose.Schema<IFamily>(
  {
  
        agent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Agent",
          required: true,
        },
  
        parent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parent",
          required: true,
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Family =
  mongoose.models.Family || mongoose.model<IFamily>("Family", familySchema);
      