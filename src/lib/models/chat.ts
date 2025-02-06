import mongoose from "mongoose";
import { ISession } from "./session";

export interface IChat {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: "user" | "system";
  content: string;
  attachments: any[];
  session: ISession;
}

export const chatSchema = new mongoose.Schema<IChat>(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "system"],
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [],
      required: false,
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
