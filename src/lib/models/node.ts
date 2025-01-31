
import mongoose from "mongoose";
import { IVersion } from "./version";


export interface INode {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  version: IVersion,
data: any
}

export const nodeSchema = new mongoose.Schema<INode>(
  {
  
        version: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Version",
          required: true,
        },
  
        data: {
          type: Object,
          required: true,
          
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Node =
  mongoose.models.Node || mongoose.model<INode>("Node", nodeSchema);
      