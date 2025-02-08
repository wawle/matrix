"use server";

import { revalidatePath } from "next/cache";
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  executeAgent,
  getAgentBySlug,
} from "@/lib/services/agent";
import { IAgent } from "../models/agent";
import { authSession } from "../dal";

export async function fetchAgents(): Promise<{
  data: {
    data: IAgent[];
    total: number;
    pageCount: number;
    pagination: { next?: { page: number; limit: number } };
  };
  error?: any;
  success: boolean;
}> {
  try {
    const agents = await getAgents();
    return { data: agents, success: true };
  } catch (error: any) {
    return {
      error: error.message,
      success: false,
      data: { data: [], total: 0, pageCount: 0, pagination: {} },
    };
  }
}

export async function fetchAgent(id: string): Promise<{
  data?: IAgent;
  success: boolean;
  error?: string;
}> {
  try {
    const agent = await getAgentById(id);
    return { data: JSON.parse(JSON.stringify(agent)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function fetchAgentBySlug(slug: string): Promise<{
  data?: IAgent;
  error?: string;
  success: boolean;
}> {
  try {
    const agent = await getAgentBySlug(slug);
    return { data: JSON.parse(JSON.stringify(agent)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createAgentAction(data: any): Promise<{
  data?: IAgent;
  success: boolean;
  error?: string;
}> {
  try {
    const agent = await createAgent(data);
    revalidatePath("/admin/agents");
    return { data: JSON.parse(JSON.stringify(agent)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateAgentAction(
  id: string,
  data: any
): Promise<{
  data?: IAgent;
  success: boolean;
  error?: string;
}> {
  try {
    const agent = await updateAgent(id, data);
    revalidatePath("/admin/agents");
    revalidatePath(`/admin/agents/${id}`, "page");
    return { data: JSON.parse(JSON.stringify(agent)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteAgentAction(id: string): Promise<{
  data?: IAgent;
  success: boolean;
  error?: string;
}> {
  try {
    const agent = await deleteAgent(id);
    revalidatePath("/admin/agents");
    revalidatePath(`/admin/agents/${id}`, "page");
    return { data: JSON.parse(JSON.stringify(agent)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
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
