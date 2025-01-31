
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getFlowSteps,
    getFlowStepById,
    createFlowStep,
    updateFlowStep,
    deleteFlowStep
  } from "@/lib/services/flowstep";
  
  export async function fetchFlowSteps() {
    try {
      const flowsteps = await getFlowSteps();
      return { data: JSON.parse(JSON.stringify(flowsteps)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchFlowStep(id: string) {
    try {
      const flowstep = await getFlowStepById(id);
      return { data: JSON.parse(JSON.stringify(flowstep)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createFlowStepAction(data: any) {
    try {
      const flowstep = await createFlowStep(data);
      revalidatePath("/flowsteps");
      return { data: JSON.parse(JSON.stringify(flowstep)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateFlowStepAction(id: string, data: any) {
    try {
      const flowstep = await updateFlowStep(id, data);
      revalidatePath("/flowsteps");
      revalidatePath("/flowsteps/[id]");
      return { data: JSON.parse(JSON.stringify(flowstep)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteFlowStepAction(id: string) {
    try {
      const flowstep = await deleteFlowStep(id);
      revalidatePath("/flowsteps");
      return { data: JSON.parse(JSON.stringify(flowstep)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }