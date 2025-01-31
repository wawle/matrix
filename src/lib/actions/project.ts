
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
  } from "@/lib/services/project";
  
  export async function fetchProjects() {
    try {
      const projects = await getProjects();
      return { data: JSON.parse(JSON.stringify(projects)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchProject(id: string) {
    try {
      const project = await getProjectById(id);
      return { data: JSON.parse(JSON.stringify(project)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createProjectAction(data: any) {
    try {
      const project = await createProject(data);
      revalidatePath("/projects");
      return { data: JSON.parse(JSON.stringify(project)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateProjectAction(id: string, data: any) {
    try {
      const project = await updateProject(id, data);
      revalidatePath("/projects");
      revalidatePath("/projects/[id]");
      return { data: JSON.parse(JSON.stringify(project)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteProjectAction(id: string) {
    try {
      const project = await deleteProject(id);
      revalidatePath("/projects");
      return { data: JSON.parse(JSON.stringify(project)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }