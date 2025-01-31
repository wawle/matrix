
import mongoose from "mongoose";
import { IProject } from "./project";


export interface IVersion {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string,
description: string,
project: IProject,
is_active: boolean
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
  
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true,
        },
  
        is_active: {
          type: Boolean,
          required: false,
          
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Version =
  mongoose.models.Version || mongoose.model<IVersion>("Version", versionSchema);
      