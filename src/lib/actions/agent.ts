"use server";

import { revalidatePath } from "next/cache";
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  executeAgent,
} from "@/lib/services/agent";
import { IAgent } from "../models/agent";
import { authSession } from "../dal";

export async function fetchAgents(): Promise<{
  data: IAgent[];
  error?: any;
  success: boolean;
}> {
  try {
    const agents = await getAgents();
    return { data: JSON.parse(JSON.stringify(agents)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: [] };
  }
}

export async function fetchAgent(id: string) {
  try {
    const agent = await getAgentById(id);
    return { data: JSON.parse(JSON.stringify(agent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createAgentAction(data: any) {
  try {
    const agent = await createAgent(data);
    revalidatePath("/agents");
    return { data: JSON.parse(JSON.stringify(agent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateAgentAction(id: string, data: any) {
  try {
    const agent = await updateAgent(id, data);
    revalidatePath("/agents");
    revalidatePath("/agents/[id]");
    return { data: JSON.parse(JSON.stringify(agent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteAgentAction(id: string) {
  try {
    const agent = await deleteAgent(id);
    revalidatePath("/agents");
    return { data: JSON.parse(JSON.stringify(agent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function executeAgentAction(
  agentId: string,
  sessionId: string,
  data: { message: string; attachments: File[] },
  onStream?: (chunk: string) => void
) {
  try {
    const user = await authSession();
    const response = await executeAgent(
      user.id,
      agentId,
      sessionId,
      data.message,
      data.attachments,
      onStream
    );
    return { data: response };
  } catch (error: any) {
    return { error: error.message };
  }
}
