"use server";

import { revalidatePath } from "next/cache";
import { VersionType } from "../models/version";
import {
  createEdge,
  deleteEdge,
  getEdgeById,
  getEdges,
  updateEdge,
} from "../services/edge";
import { IEdge } from "../models/edge";

export async function fetchEdges() {
  try {
    const edges = await getEdges();
    return { data: JSON.parse(JSON.stringify(edges)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchEdge(id: string): Promise<{
  data?: IEdge<VersionType>;
  error?: string;
  success: boolean;
}> {
  try {
    const edge = await getEdgeById(id);
    return { data: JSON.parse(JSON.stringify(edge)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createEdgeAction(data: any): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const edge = await createEdge(data);
    revalidatePath("/admin/edges");
    return { data: JSON.parse(JSON.stringify(edge)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateEdgeAction(
  id: string,
  data: any
): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const edge = await updateEdge(id, data);
    revalidatePath("/admin/edges");
    return { data: JSON.parse(JSON.stringify(edge)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteEdgeAction(id: string): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const edge = await deleteEdge(id);
    revalidatePath("/admin/edges");
    return { data: JSON.parse(JSON.stringify(edge)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
