"use server";

import { revalidatePath } from "next/cache";
import {
  getNodes,
  getNodeById,
  createNode,
  updateNode,
  deleteNode,
} from "@/lib/services/node";

export async function fetchNodes() {
  try {
    const nodes = await getNodes();
    return { data: JSON.parse(JSON.stringify(nodes)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchNode(id: string) {
  try {
    const node = await getNodeById(id);
    return { data: JSON.parse(JSON.stringify(node)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createNodeAction(data: any): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const node = await createNode(data);
    revalidatePath("/nodes");
    return { data: JSON.parse(JSON.stringify(node)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateNodeAction(
  id: string,
  data: any
): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const node = await updateNode(id, data);
    revalidatePath("/admin/nodes");
    revalidatePath("/admin/nodes/[id]", "page");
    return { data: JSON.parse(JSON.stringify(node)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteNodeAction(id: string): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const node = await deleteNode(id);
    revalidatePath("/nodes");
    return { data: JSON.parse(JSON.stringify(node)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
