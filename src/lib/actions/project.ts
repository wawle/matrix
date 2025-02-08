"use server";

import { revalidatePath } from "next/cache";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
} from "@/lib/services/project";
import { IProject } from "../models/project";
import { authSession } from "../dal";

export async function fetchProjects(): Promise<{
  data: IProject[];
  error?: any;
}> {
  try {
    const projects = await getProjects();
    return { data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    return { error: error.message, data: [] };
  }
}

export async function fetchProject(id: string): Promise<{
  data?: IProject;
  success: boolean;
  error?: string;
}> {
  try {
    const project = await getProjectById(id);
    return { data: JSON.parse(JSON.stringify(project)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function fetchProjectBySlug(slug: string): Promise<{
  data?: IProject;
  success: boolean;
  error?: string;
}> {
  try {
    const project = await getProjectBySlug(slug);
    return { data: JSON.parse(JSON.stringify(project)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createProjectAction(data: any): Promise<{
  data?: IProject;
  success: boolean;
  error?: any;
}> {
  try {
    const user = await authSession();
    const project = await createProject({ ...data, user: user?.id });
    revalidatePath("/xgo/projects");
    return { data: JSON.parse(JSON.stringify(project)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateProjectAction(
  id: string,
  data: any
): Promise<{
  data?: IProject;
  success: boolean;
  error?: any;
}> {
  try {
    const project = await updateProject(id, data);
    revalidatePath("/projects");
    revalidatePath("/projects/[id]");
    return { data: JSON.parse(JSON.stringify(project)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteProjectAction(id: string): Promise<{
  success: boolean;
  data?: IProject;
  error?: any;
}> {
  try {
    const project = await deleteProject(id);
    revalidatePath("/projects");
    return { data: JSON.parse(JSON.stringify(project)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}
