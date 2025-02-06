import { Agent, IAgent } from "@/lib/models/agent";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getAgents = asyncFnService(async (): Promise<IAgent[]> => {
  await connectDB();
  const agents = await Agent.find().sort({ createdAt: -1 });
  return agents;
});

export const getAgentById = asyncFnService(
  async (id: string): Promise<IAgent> => {
    await connectDB();
    const agent = await Agent.findById(id).populate({
      path: "sessions",
      populate: {
        path: "chats",
      },
    });
    if (!agent) {
      throw new ErrorResponse("Agent bulunamadı", 404);
    }
    return agent;
  }
);

export const createAgent = asyncFnService(
  async (data: any): Promise<IAgent> => {
    await connectDB();
    const agent = await Agent.create(data);
    if (!agent) {
      throw new ErrorResponse("Agent oluşturulurken bir hata oluştu", 400);
    }
    return agent;
  }
);

export const updateAgent = asyncFnService(
  async (id: string, data: any): Promise<IAgent> => {
    await connectDB();
    const agent = await Agent.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!agent) {
      throw new ErrorResponse("Agent bulunamadı", 404);
    }
    return agent;
  }
);

export const deleteAgent = asyncFnService(
  async (id: string): Promise<IAgent> => {
    await connectDB();
    const agent = await Agent.findByIdAndDelete(id);
    if (!agent) {
      throw new ErrorResponse("Agent bulunamadı", 404);
    }
    return agent;
  }
);

export const executeAgent = asyncFnService(
  async (
    userId: string,
    agentId: string,
    sessionId: string,
    message: string,
    attachments: File[]
  ) => {
    await connectDB();
    const agent = await Agent.findById(agentId);
    if (!agent) {
      throw new ErrorResponse("Agent bulunamadı", 404);
    }
    return await agent.execute(userId, sessionId, message, attachments);
  }
);
