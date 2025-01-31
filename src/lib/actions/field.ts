
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getFields,
    getFieldById,
    createField,
    updateField,
    deleteField
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
  
  export async function createFieldAction(data: any) {
    try {
      const field = await createField(data);
      revalidatePath("/fields");
      return { data: JSON.parse(JSON.stringify(field)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateFieldAction(id: string, data: any) {
    try {
      const field = await updateField(id, data);
      revalidatePath("/fields");
      revalidatePath("/fields/[id]");
      return { data: JSON.parse(JSON.stringify(field)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteFieldAction(id: string) {
    try {
      const field = await deleteField(id);
      revalidatePath("/fields");
      return { data: JSON.parse(JSON.stringify(field)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }