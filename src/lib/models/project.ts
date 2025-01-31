
import mongoose from "mongoose";
import { IUser } from "./user";


export interface IProject {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string,
description: string,
user: IUser
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
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
      