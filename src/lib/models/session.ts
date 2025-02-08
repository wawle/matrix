import mongoose from "mongoose";
import { ErrorResponse } from "../middlewares/error";
import { IUser } from "./user";
import { Chat, IChat } from "./chat";
import slugify from "slugify";
import { IAgent } from "./agent";

export interface ISession {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  agent: IAgent;
  user: IUser;
  chats: IChat[];
  slug?: string;
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
    slug: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sessionSchema.pre("save", async function (next) {
  const agent: IAgent | null = await this.model("Agent").findById(this.agent);
  if (!agent) {
    return next(new ErrorResponse("Agent not found", 404));
  }
  const title = `${agent.name}-${new Date().toISOString()}`;
  this.slug = slugify(title, { lower: true });
  next();
});

sessionSchema.pre("findOneAndUpdate", async function (next) {
  const { agent } = this.getQuery();
  this.findOneAndUpdate(
    { agent },
    { slug: slugify(agent.name, { lower: true }) }
  );
  next();
});

sessionSchema.virtual("chats", {
  ref: Chat,
  localField: "_id",
  foreignField: "session",
});

sessionSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([Chat.deleteMany({ session: _id })]);
  next();
});

export const Session =
  mongoose.models?.Session ||
  mongoose.model<ISession>("Session", sessionSchema);
