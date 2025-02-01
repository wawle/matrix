"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  getVersions,
  getVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
} from "@/lib/services/version";
import { cookies } from "next/headers";
import { Node } from "reactflow";

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

export async function deleteVersionAction(id: string): Promise<{
  data?: any;
  error?: string;
  success?: boolean;
}> {
  try {
    const version = await deleteVersion(id);
    revalidatePath("/versions");
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
