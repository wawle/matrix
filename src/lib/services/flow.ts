import { Flow, IFlow } from "@/lib/models/flow";
import connectDB from "@/lib/db";
import { FlowStep } from "../models/flowstep";
import { Agent } from "../models/agent";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";
import { Node } from "../models/node";
import { Edge } from "../models/edge";

export const getFlows = asyncFnService(async (): Promise<IFlow[]> => {
  await connectDB();
  const flows = await Flow.find()
    .populate({
      path: "steps",
      model: FlowStep,
      select: "agent order",
      populate: {
        path: "agent",
        model: Agent,
      },
    })
    .sort({ createdAt: -1 });
  return flows;
});

export const getFlowById = asyncFnService(
  async (id: string): Promise<IFlow> => {
    await connectDB();
    const flow = await Flow.findById(id).populate([
      {
        path: "steps",
        model: FlowStep,
        select: "agent order",
        populate: {
          path: "agent",
          model: Agent,
        },
      },
      {
        path: "nodes",
        model: Node,
      },
      {
        path: "edges",
        model: Edge,
      },
    ]);
    if (!flow) {
      throw new ErrorResponse("Flow bulunamadı", 404);
    }
    return flow;
  }
);

export const createFlow = asyncFnService(async (data: any): Promise<IFlow> => {
  await connectDB();
  const flow = await Flow.create(data);
  if (!flow) {
    throw new ErrorResponse("Flow oluşturulurken bir hata oluştu", 500);
  }
  return flow;
});

export const updateFlow = asyncFnService(
  async (id: string, data: any): Promise<IFlow> => {
    await connectDB();
    const flow = await Flow.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!flow) {
      throw new ErrorResponse("Flow bulunamadı", 404);
    }
    return flow;
  }
);

export const deleteFlow = asyncFnService(async (id: string): Promise<IFlow> => {
  await connectDB();
  const flow = await Flow.findByIdAndDelete(id);
  if (!flow) {
    throw new ErrorResponse("Flow bulunamadı", 404);
  }
  return flow;
});
