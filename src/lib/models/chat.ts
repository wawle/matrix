import mongoose from "mongoose";
import { ISession } from "./session";

export interface IChat {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  sender: "user" | "system";
  message: string;
  attachments: File[];
  session: ISession;
}

export const chatSchema = new mongoose.Schema<IChat>(
  {
    sender: {
      type: String,
      required: true,
      enum: ["user", "system"],
    },
    message: {
      type: String,
      required: true,
    },
    attachments: {
      type: [File],
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
