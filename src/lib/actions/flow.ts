"use server";

import { revalidatePath } from "next/cache";
import {
  getFlows,
  getFlowById,
  createFlow,
  updateFlow,
  deleteFlow,
} from "@/lib/services/flow";
import { IFlow } from "../models/flow";

export async function fetchFlows(): Promise<{ data: IFlow[]; error?: any }> {
  try {
    const flows = await getFlows();
    return { data: JSON.parse(JSON.stringify(flows)) };
  } catch (error: any) {
    return { error: error.message, data: [] };
  }
}

export async function fetchFlow(id: string) {
  try {
    const flow = await getFlowById(id);
    return { data: JSON.parse(JSON.stringify(flow)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFlowAction(data: any) {
  try {
    const flow = await createFlow(data);
    revalidatePath("/flows");
    return { data: JSON.parse(JSON.stringify(flow)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateFlowAction(id: string, data: any) {
  try {
    const flow = await updateFlow(id, data);
    revalidatePath("/flows");
    revalidatePath("/flows/[id]");
    return { data: JSON.parse(JSON.stringify(flow)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteFlowAction(id: string) {
  try {
    const flow = await deleteFlow(id);
    revalidatePath("/flows");
    return { data: JSON.parse(JSON.stringify(flow)) };
  } catch (error: any) {
    return { error: error.message };
  }
}
