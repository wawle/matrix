import mongoose from "mongoose";
import { FlowStep, IFlowStep } from "./flowstep";
import { FlowSession } from "./flowsession";
import { IProject } from "./project";

export interface IFlow {
  id: string;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  project: IProject;
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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
