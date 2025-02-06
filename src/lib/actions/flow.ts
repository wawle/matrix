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
import { authSession } from "../dal";

export async function fetchFlows(): Promise<{ data: IFlow[]; error?: any }> {
  try {
    const flows = await getFlows();
    return { data: JSON.parse(JSON.stringify(flows)) };
  } catch (error: any) {
    return { error: error.message, data: [] };
  }
}

export async function fetchFlow(id: string): Promise<{
  data?: IFlow;
  error?: any;
  success: boolean;
}> {
  try {
    const flow = await getFlowById(id);
    return { data: JSON.parse(JSON.stringify(flow)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createFlowAction(
  data: any
): Promise<{ data?: IFlow; error?: any; success: boolean }> {
  try {
    const user = await authSession();
    const flow = await createFlow({ ...data, user: user.id });
    revalidatePath("/flowish/flows");
    revalidatePath(`/flowish/flows/${flow._id}`, "page");
    revalidatePath(`/admin/flows`);
    revalidatePath(`/admin/flows/${flow._id}`, "page");
    return { data: JSON.parse(JSON.stringify(flow)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateFlowAction(
  id: string,
  data: any
): Promise<{ data?: IFlow; error?: any; success: boolean }> {
  try {
    const user = await authSession();
    const flow = await updateFlow(id, { ...data, user: user.id });
    revalidatePath("/flowish/flows");
    revalidatePath(`/flowish/flows/${flow._id}`, "page");
    revalidatePath("/admin/flows");
    revalidatePath(`/admin/flows/${flow._id}`, "page");
    return { data: JSON.parse(JSON.stringify(flow)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteFlowAction(
  id: string
): Promise<{ data?: IFlow; error?: any; success: boolean }> {
  try {
    const flow = await deleteFlow(id);
    revalidatePath("/flows");
    return { data: JSON.parse(JSON.stringify(flow)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
