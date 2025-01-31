import { Flow, IFlow } from "@/lib/models/flow";
import connectDB from "@/lib/db";
import { FlowStep } from "../models/flowstep";
import { Agent } from "../models/agent";

export async function getFlows(): Promise<IFlow[]> {
  try {
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
  } catch (error: any) {
    throw new Error(error.message || "Flow listesi alınırken bir hata oluştu");
  }
}

export async function getFlowById(id: string): Promise<IFlow> {
  try {
    await connectDB();
    const flow = await Flow.findById(id);
    if (!flow) {
      throw new Error("Flow bulunamadı");
    }
    return flow;
  } catch (error: any) {
    throw new Error(error.message || "Flow alınırken bir hata oluştu");
  }
}

export async function createFlow(data: any): Promise<IFlow> {
  try {
    await connectDB();
    const flow = await Flow.create(data);
    return flow;
  } catch (error: any) {
    throw new Error(error.message || "Flow oluşturulurken bir hata oluştu");
  }
}

export async function updateFlow(id: string, data: any): Promise<IFlow> {
  try {
    await connectDB();
    const flow = await Flow.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!flow) {
      throw new Error("Flow bulunamadı");
    }
    return flow;
  } catch (error: any) {
    throw new Error(error.message || "Flow güncellenirken bir hata oluştu");
  }
}

export async function deleteFlow(id: string): Promise<IFlow> {
  try {
    await connectDB();
    const flow = await Flow.findByIdAndDelete(id);
    if (!flow) {
      throw new Error("Flow bulunamadı");
    }
    return flow;
  } catch (error: any) {
    throw new Error(error.message || "Flow silinirken bir hata oluştu");
  }
}
