"use server";

import { revalidatePath } from "next/cache";
import {
  getModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
} from "@/lib/services/model";
import { IModel } from "../models/model";

export async function fetchModels(query: any): Promise<{
  data: IModel[];
  error?: string;
  success: boolean;
}> {
  try {
    const models = await getModels(query);
    return { data: JSON.parse(JSON.stringify(models)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: [] };
  }
}

export async function fetchModel(id: string) {
  try {
    const model = await getModelById(id);
    return { data: JSON.parse(JSON.stringify(model)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createModelAction(data: any): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const model = await createModel(data);
    revalidatePath("/models");
    return { data: JSON.parse(JSON.stringify(model)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateModelAction(
  id: string,
  data: IModel
): Promise<{
  data?: IModel;
  error?: string;
  success: boolean;
}> {
  try {
    const model = await updateModel(id, data);
    revalidatePath("/models");
    revalidatePath("/models/[id]");
    return { data: JSON.parse(JSON.stringify(model)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteModelAction(id: string): Promise<{
  data?: IModel;
  error?: string;
  success: boolean;
}> {
  try {
    const model = await deleteModel(id);
    revalidatePath("/models");
    return { data: JSON.parse(JSON.stringify(model)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
