
import mongoose from "mongoose";
import { IVersion } from "./version";


export interface IModel {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string,
version: IVersion,
description: string
}

export const modelSchema = new mongoose.Schema<IModel>(
  {
  
        name: {
          type: String,
          required: true,
          
        },
  
        version: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Version",
          required: true,
        },
  
        description: {
          type: String,
          required: false,
          
        }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const Model =
  mongoose.models.Model || mongoose.model<IModel>("Model", modelSchema);
      