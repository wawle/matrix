import { FlowStep, IFlowStep } from "@/lib/models/flowstep";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getFlowSteps = asyncFnService(async (): Promise<IFlowStep[]> => {
  await connectDB();
  const flowsteps = await FlowStep.find().sort({ createdAt: -1 });
  return flowsteps;
});

export const getFlowStepById = asyncFnService(
  async (id: string): Promise<IFlowStep> => {
    await connectDB();
    const flowstep = await FlowStep.findById(id);
    if (!flowstep) {
      throw new ErrorResponse("FlowStep bulunamadı", 404);
    }
    return flowstep;
  }
);

export const createFlowStep = asyncFnService(
  async (data: any): Promise<IFlowStep> => {
    await connectDB();
    const flowstep = await FlowStep.create(data);
    if (!flowstep) {
      throw new ErrorResponse("FlowStep oluşturulurken bir hata oluştu", 500);
    }
    return flowstep;
  }
);

export const updateFlowStep = asyncFnService(
  async (id: string, data: any): Promise<IFlowStep> => {
    await connectDB();
    const flowstep = await FlowStep.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!flowstep) {
      throw new ErrorResponse("FlowStep bulunamadı", 404);
    }
    return flowstep;
  }
);

export const deleteFlowStep = asyncFnService(
  async (id: string): Promise<IFlowStep> => {
    await connectDB();
    const flowstep = await FlowStep.findByIdAndDelete(id);
    if (!flowstep) {
      throw new ErrorResponse("FlowStep bulunamadı", 404);
    }
    return flowstep;
  }
);
