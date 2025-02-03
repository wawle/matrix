import { FlowSession, IFlowSession } from "@/lib/models/flowsession";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getFlowSessions = asyncFnService(
  async (): Promise<IFlowSession[]> => {
    await connectDB();
    const flowsessions = await FlowSession.find().sort({ createdAt: -1 });
    return flowsessions;
  }
);

export const getFlowSessionById = asyncFnService(
  async (id: string): Promise<IFlowSession> => {
    await connectDB();
    const flowsession = await FlowSession.findById(id);
    if (!flowsession) {
      throw new ErrorResponse("FlowSession bulunamadı", 404);
    }
    return flowsession;
  }
);

export const createFlowSession = asyncFnService(
  async (data: any): Promise<IFlowSession> => {
    await connectDB();
    const flowsession = await FlowSession.create(data);
    if (!flowsession) {
      throw new ErrorResponse(
        "FlowSession oluşturulurken bir hata oluştu",
        500
      );
    }
    return flowsession;
  }
);

export const updateFlowSession = asyncFnService(
  async (id: string, data: any): Promise<IFlowSession> => {
    await connectDB();
    const flowsession = await FlowSession.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!flowsession) {
      throw new ErrorResponse("FlowSession bulunamadı", 404);
    }
    return flowsession;
  }
);

export const deleteFlowSession = asyncFnService(
  async (id: string): Promise<IFlowSession> => {
    await connectDB();
    const flowsession = await FlowSession.findByIdAndDelete(id);
    if (!flowsession) {
      throw new ErrorResponse("FlowSession bulunamadı", 404);
    }
    return flowsession;
  }
);
