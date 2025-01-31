
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getNodes,
    getNodeById,
    createNode,
    updateNode,
    deleteNode
  } from "@/lib/services/node";
  
  export async function fetchNodes() {
    try {
      const nodes = await getNodes();
      return { data: JSON.parse(JSON.stringify(nodes)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchNode(id: string) {
    try {
      const node = await getNodeById(id);
      return { data: JSON.parse(JSON.stringify(node)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createNodeAction(data: any) {
    try {
      const node = await createNode(data);
      revalidatePath("/nodes");
      return { data: JSON.parse(JSON.stringify(node)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateNodeAction(id: string, data: any) {
    try {
      const node = await updateNode(id, data);
      revalidatePath("/nodes");
      revalidatePath("/nodes/[id]");
      return { data: JSON.parse(JSON.stringify(node)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteNodeAction(id: string) {
    try {
      const node = await deleteNode(id);
      revalidatePath("/nodes");
      return { data: JSON.parse(JSON.stringify(node)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }