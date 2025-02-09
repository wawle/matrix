"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  getVersions,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
  getVersionBySlug,
} from "@/lib/services/version";
import { cookies } from "next/headers";
import { Node } from "reactflow";
import { IVersion, VersionType } from "../models/version";
import { fetchProject } from "./project";
import { createNextProject } from "../xgo/generators/app";

export async function fetchVersions() {
  try {
    const versions = await getVersions();
    return { data: JSON.parse(JSON.stringify(versions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchVersion(id: string): Promise<{
  data?: IVersion<VersionType>;
  error?: string;
  success: boolean;
}> {
  try {
    const version = await getVersionById(id);
    return { data: JSON.parse(JSON.stringify(version)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function fetchVersionBySlug(slug: string): Promise<{
  data?: IVersion<VersionType>;
  error?: string;
  success: boolean;
}> {
  try {
    const version = await getVersionBySlug(slug);
    return { data: JSON.parse(JSON.stringify(version)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createVersionAction(data: any): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const version = await createVersion(data);
    revalidatePath("/versions");
    return { data: JSON.parse(JSON.stringify(version)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function updateVersionAction(
  id: string,
  data: any
): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const version = await updateVersion(id, data);
    revalidatePath("/admin/versions");
    return { data: JSON.parse(JSON.stringify(version)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function deleteVersionAction(id: string): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const version = await deleteVersion(id);
    revalidatePath("/admin/versions");
    return { data: JSON.parse(JSON.stringify(version)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

/**
 * @description AutoSave durumunu cookie'den alır
 * @returns {Promise<boolean>} AutoSave durumu
 */
export const getAutoSaveState = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const autoSave = cookieStore.get("autoSave")?.value;
  return autoSave === "true";
};

/**
 * @description AutoSave durumunu cookie'ye kaydeder
 * @param {boolean} state - Kaydedilecek AutoSave durumu
 */
export const setAutoSaveState = async (state: boolean): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("autoSave", state.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
};

export async function generateVersionAction(
  prompt: string,
  projectId?: string,
  existingNodes?: Node[],
  versionId?: string
) {
  try {
    if (!projectId) {
      return {
        success: false,
        error: "Project ID bulunamadı",
      };
    }

    if (!prompt) {
      return {
        success: false,
        error: "Prompt bulunamadı",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/versions/generate`,
      {
        method: "POST",
        body: JSON.stringify({
          prompt,
          projectId,
          type: "version",
          existingNodes,
          versionId,
        }),
        next: { tags: ["versions"] },
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    revalidateTag("versions");

    return { success: true, version: data.version };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Version oluşturulurken bir hata oluştu",
    };
  }
}

export async function generatePromptForVersion(prompt: string) {
  try {
    if (!prompt) {
      return {
        success: false,
        error: "Prompt bulunamadı",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/versions/generate`,
      {
        method: "POST",
        body: JSON.stringify({
          prompt,
          type: "prompt",
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, prompt: data.prompt };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Prompt oluşturulurken bir hata oluştu",
    };
  }
}

export async function generateAppAction(
  versionId: string,
  projectId: string
): Promise<{
  success: boolean;
  error?: string;
  projectName?: string;
}> {
  try {
    const [project, version] = await Promise.all([
      fetchProject(projectId),
      fetchVersion(versionId),
    ]);

    if (
      !version.success ||
      !project.success ||
      !version.data ||
      !project.data
    ) {
      throw new Error(version.error || project.error);
    }

    const appData = {
      projectName: project.data.name,
      version: version.data as IVersion<VersionType.MODEL>,
    };

    const result = await createNextProject(appData);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, projectName: project.data.name };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Version oluşturulurken bir hata oluştu",
    };
  }
}
