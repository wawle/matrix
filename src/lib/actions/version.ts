
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getVersions,
    getVersionById,
    createVersion,
    updateVersion,
    deleteVersion
  } from "@/lib/services/version";
  
  export async function fetchVersions() {
    try {
      const versions = await getVersions();
      return { data: JSON.parse(JSON.stringify(versions)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchVersion(id: string) {
    try {
      const version = await getVersionById(id);
      return { data: JSON.parse(JSON.stringify(version)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createVersionAction(data: any) {
    try {
      const version = await createVersion(data);
      revalidatePath("/versions");
      return { data: JSON.parse(JSON.stringify(version)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateVersionAction(id: string, data: any) {
    try {
      const version = await updateVersion(id, data);
      revalidatePath("/versions");
      revalidatePath("/versions/[id]");
      return { data: JSON.parse(JSON.stringify(version)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteVersionAction(id: string) {
    try {
      const version = await deleteVersion(id);
      revalidatePath("/versions");
      return { data: JSON.parse(JSON.stringify(version)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }