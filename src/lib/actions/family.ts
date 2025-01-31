
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getFamilys,
    getFamilyById,
    createFamily,
    updateFamily,
    deleteFamily
  } from "@/lib/services/family";
  
  export async function fetchFamilys() {
    try {
      const familys = await getFamilys();
      return { data: JSON.parse(JSON.stringify(familys)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchFamily(id: string) {
    try {
      const family = await getFamilyById(id);
      return { data: JSON.parse(JSON.stringify(family)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createFamilyAction(data: any) {
    try {
      const family = await createFamily(data);
      revalidatePath("/familys");
      return { data: JSON.parse(JSON.stringify(family)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateFamilyAction(id: string, data: any) {
    try {
      const family = await updateFamily(id, data);
      revalidatePath("/familys");
      revalidatePath("/familys/[id]");
      return { data: JSON.parse(JSON.stringify(family)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteFamilyAction(id: string) {
    try {
      const family = await deleteFamily(id);
      revalidatePath("/familys");
      return { data: JSON.parse(JSON.stringify(family)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }