
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getHirings,
    getHiringById,
    createHiring,
    updateHiring,
    deleteHiring
  } from "@/lib/services/hiring";
  
  export async function fetchHirings() {
    try {
      const hirings = await getHirings();
      return { data: JSON.parse(JSON.stringify(hirings)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchHiring(id: string) {
    try {
      const hiring = await getHiringById(id);
      return { data: JSON.parse(JSON.stringify(hiring)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createHiringAction(data: any) {
    try {
      const hiring = await createHiring(data);
      revalidatePath("/hirings");
      return { data: JSON.parse(JSON.stringify(hiring)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateHiringAction(id: string, data: any) {
    try {
      const hiring = await updateHiring(id, data);
      revalidatePath("/hirings");
      revalidatePath("/hirings/[id]");
      return { data: JSON.parse(JSON.stringify(hiring)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteHiringAction(id: string) {
    try {
      const hiring = await deleteHiring(id);
      revalidatePath("/hirings");
      return { data: JSON.parse(JSON.stringify(hiring)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }