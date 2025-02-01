import mongoose from "mongoose";
import { IFlow } from "./flow";
import { ISession } from "./session";

export interface IFlowSession {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  flow: IFlow;
  session: ISession;
}

export const flowsessionSchema = new mongoose.Schema<IFlowSession>(
  {
    flow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flow",
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

export const FlowSession =
  mongoose.models.FlowSession ||
  mongoose.model<IFlowSession>("FlowSession", flowsessionSchema);
