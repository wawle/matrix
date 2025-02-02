"use server";

import { revalidatePath } from "next/cache";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "@/lib/services/field";

export async function fetchFields() {
  try {
    const fields = await getFields();
    return { data: JSON.parse(JSON.stringify(fields)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchField(id: string) {
  try {
    const field = await getFieldById(id);
    return { data: JSON.parse(JSON.stringify(field)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFieldAction(data: any): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const field = await createField(data);
    revalidatePath("/admin/fields");
    return { data: JSON.parse(JSON.stringify(field)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateFieldAction(
  id: string,
  data: any
): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const field = await updateField(id, data);
    revalidatePath("/admin/fields");
    revalidatePath("/admin/fields/[id]", "page");
    return { data: JSON.parse(JSON.stringify(field)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteFieldAction(id: string): Promise<{
  data?: any;
  error?: string;
  success: boolean;
}> {
  try {
    const field = await deleteField(id);
    revalidatePath("/admin/fields");
    return { data: JSON.parse(JSON.stringify(field)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
