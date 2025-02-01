import mongoose from "mongoose";
import { IKey } from "./key";
import { Hiring } from "./hiring";
import { Flow } from "./flow";
import { FlowStep } from "./flowstep";
import { Family } from "./family";
import { Session } from "./session";

export interface IAgent {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  instructions: string;
  stream: boolean;
  model_provider: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  seed: number;
  name: string;
  title: string;
  is_public: boolean;
  photo: string;
  key: IKey;
}

export const agentSchema = new mongoose.Schema<IAgent>(
  {
    instructions: {
      type: String,
      required: true,
    },
    stream: {
      type: Boolean,
      required: false,
    },
    model_provider: {
      type: String,
      required: true,
    },
    model_name: {
      type: String,
      required: true,
    },
    max_tokens: {
      type: Number,
      required: false,
    },
    temperature: {
      type: Number,
      required: false,
    },
    seed: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    is_public: {
      type: Boolean,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    key: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Key",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

agentSchema.virtual("contracts", {
  ref: Hiring,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("flowsteps", {
  ref: FlowStep,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("parents", {
  ref: Family,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.virtual("sessions", {
  ref: Session,
  localField: "_id",
  foreignField: "agent",
});

agentSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    FlowStep.deleteMany({ agent: _id }),
    Hiring.deleteMany({ agent: _id }),
    Family.deleteMany({ agent: _id }),
    Family.deleteMany({ parent: _id }),
    Session.deleteMany({ agent: _id }),
  ]);
  next();
});

export const Agent =
  mongoose.models.Agent || mongoose.model<IAgent>("Agent", agentSchema);
