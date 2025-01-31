
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getFlowSessions,
    getFlowSessionById,
    createFlowSession,
    updateFlowSession,
    deleteFlowSession
  } from "@/lib/services/flowsession";
  
  export async function fetchFlowSessions() {
    try {
      const flowsessions = await getFlowSessions();
      return { data: JSON.parse(JSON.stringify(flowsessions)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchFlowSession(id: string) {
    try {
      const flowsession = await getFlowSessionById(id);
      return { data: JSON.parse(JSON.stringify(flowsession)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createFlowSessionAction(data: any) {
    try {
      const flowsession = await createFlowSession(data);
      revalidatePath("/flowsessions");
      return { data: JSON.parse(JSON.stringify(flowsession)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateFlowSessionAction(id: string, data: any) {
    try {
      const flowsession = await updateFlowSession(id, data);
      revalidatePath("/flowsessions");
      revalidatePath("/flowsessions/[id]");
      return { data: JSON.parse(JSON.stringify(flowsession)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteFlowSessionAction(id: string) {
    try {
      const flowsession = await deleteFlowSession(id);
      revalidatePath("/flowsessions");
      return { data: JSON.parse(JSON.stringify(flowsession)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }