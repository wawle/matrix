import mongoose from "mongoose";
import { IAgent } from "./agent";
import { IUser } from "./user";
import { Chat } from "./chat";
import { FlowSession } from "./flowsession";

export interface ISession {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  agent: IAgent;
  user: IUser;
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
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sessionSchema.virtual("chats", {
  ref: Chat,
  localField: "_id",
  foreignField: "session",
});

sessionSchema.virtual("flowsessions", {
  ref: FlowSession,
  localField: "_id",
  foreignField: "session",
});

sessionSchema.pre("deleteOne", async function (next) {
  const session = this.getQuery();
  await Promise.all([
    Chat.deleteMany({ session: session }),
    FlowSession.deleteMany({ session: session }),
  ]);
  next();
});

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
