
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getEdges,
    getEdgeById,
    createEdge,
    updateEdge,
    deleteEdge
  } from "@/lib/services/edge";
  
  export async function fetchEdges() {
    try {
      const edges = await getEdges();
      return { data: JSON.parse(JSON.stringify(edges)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchEdge(id: string) {
    try {
      const edge = await getEdgeById(id);
      return { data: JSON.parse(JSON.stringify(edge)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createEdgeAction(data: any) {
    try {
      const edge = await createEdge(data);
      revalidatePath("/edges");
      return { data: JSON.parse(JSON.stringify(edge)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateEdgeAction(id: string, data: any) {
    try {
      const edge = await updateEdge(id, data);
      revalidatePath("/edges");
      revalidatePath("/edges/[id]");
      return { data: JSON.parse(JSON.stringify(edge)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteEdgeAction(id: string) {
    try {
      const edge = await deleteEdge(id);
      revalidatePath("/edges");
      return { data: JSON.parse(JSON.stringify(edge)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }