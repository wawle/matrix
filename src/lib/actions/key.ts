
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getKeys,
    getKeyById,
    createKey,
    updateKey,
    deleteKey
  } from "@/lib/services/key";
  
  export async function fetchKeys() {
    try {
      const keys = await getKeys();
      return { data: JSON.parse(JSON.stringify(keys)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchKey(id: string) {
    try {
      const key = await getKeyById(id);
      return { data: JSON.parse(JSON.stringify(key)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createKeyAction(data: any) {
    try {
      const key = await createKey(data);
      revalidatePath("/keys");
      return { data: JSON.parse(JSON.stringify(key)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateKeyAction(id: string, data: any) {
    try {
      const key = await updateKey(id, data);
      revalidatePath("/keys");
      revalidatePath("/keys/[id]");
      return { data: JSON.parse(JSON.stringify(key)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteKeyAction(id: string) {
    try {
      const key = await deleteKey(id);
      revalidatePath("/keys");
      return { data: JSON.parse(JSON.stringify(key)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }