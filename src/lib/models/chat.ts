import mongoose from "mongoose";
import { ISession } from "./session";

export interface IChat {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  sender: string;
  message: string;
  session: ISession;
}

export const chatSchema = new mongoose.Schema<IChat>(
  {
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Chat =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);
