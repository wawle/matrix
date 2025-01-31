import mongoose from "mongoose";
import { IFlow } from "./flow";
import { IAgent } from "./agent";

export interface IFlowStep {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  flow: IFlow;
  agent: IAgent;
  order: number;
}

export const flowstepSchema = new mongoose.Schema<IFlowStep>(
  {
    flow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flow",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const FlowStep =
  mongoose.models.FlowStep ||
  mongoose.model<IFlowStep>("FlowStep", flowstepSchema);
