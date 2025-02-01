import mongoose from "mongoose";
import { IUser } from "./user";
import { FlowStep, IFlowStep } from "./flowstep";
import { FlowSession } from "./flowsession";

export interface IFlow {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  user: IUser;
  steps: IFlowStep[];
}

export const flowSchema = new mongoose.Schema<IFlow>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
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

flowSchema.virtual("steps", {
  ref: FlowStep,
  localField: "_id",
  foreignField: "flow",
});

flowSchema.virtual("sessions", {
  ref: FlowSession,
  localField: "_id",
  foreignField: "flow",
});

flowSchema.pre("findOneAndDelete", async function (next) {
  const { _id } = this.getQuery();
  await Promise.all([
    FlowStep.deleteMany({ flow: _id }),
    FlowSession.deleteMany({ flow: _id }),
  ]);
  next();
});

export const Flow =
  mongoose.models.Flow || mongoose.model<IFlow>("Flow", flowSchema);
