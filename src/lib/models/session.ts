import mongoose from "mongoose";
import { IAgent } from "./agent";
import { IUser } from "./user";
import { Chat, IChat } from "./chat";
import { FlowSession } from "./flowsession";

export interface ISession {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  agent: IAgent;
  user: IUser;
  chats: IChat[];
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

sessionSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    Chat.deleteMany({ session: _id }),
    FlowSession.deleteMany({ session: _id }),
  ]);
  next();
});

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
