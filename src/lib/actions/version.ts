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
import { IVersion } from "../models/version";
import { convertTemplateToVersion } from "../utils";
import { createModelAction } from "./model";
import { createFieldAction } from "./field";
import { createNodeAction } from "./node";
import { createEdgeAction } from "./edge";

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

export const generateVersionFromTemplate = async (
  template: IVersion,
  projectId: string
) => {
  try {
    let newVersion = convertTemplateToVersion(template, projectId);

    const newVersionBody = {
      name: `${newVersion.name} - v1.0.0`,
      description: newVersion.description,
      is_active: true,
      project: projectId,
    };

    const createdVersion = await createVersionAction(newVersionBody);

    if (!createdVersion.success) {
      throw new Error(createdVersion.error);
    }

    const newModelsBody = newVersion.models.map((model) => ({
      name: model.name,
      version: createdVersion.data.id,
      description: model.description,
    }));

    const newNodesBody = newVersion.nodes.map((node) => ({
      data: node.data,
      position: node.position,
      type: node.type,
      version: createdVersion.data.id,
    }));

    const [createdModels, createdNodes] = await Promise.all([
      Promise.all(newModelsBody.map((model) => createModelAction(model))),
      Promise.all(newNodesBody.map((node) => createNodeAction(node))),
    ]);

    const allModelsSuccess = createdModels.every((model) => model.success);
    const allNodesSuccess = createdNodes.every((node) => node.success);

    if (!allModelsSuccess || !allNodesSuccess) {
      throw new Error("Model veya Node oluşturulurken bir hata oluştu");
    }

    const newEdgesBody = newVersion.edges.map((edge) => {
      const sourceNode = createdNodes.find(
        (n) => n.data.data.name === edge.source
      );
      const targetNode = createdNodes.find(
        (n) => n.data.data.name === edge.target
      );

      return {
        ...edge,
        version: createdVersion.data.id,
        source: sourceNode?.data.id,
        target: targetNode?.data.id,
      };
    });

    console.log({ newEdgesBody, createdNodes: createdNodes[0] });

    const createdEdges = await Promise.all(
      newEdgesBody.map((edge) => createEdgeAction(edge))
    );

    const allEdgesSuccess = createdEdges.every((edge) => edge.success);

    if (!allEdgesSuccess) {
      throw new Error("Edge oluşturulurken bir hata oluştu");
    }

    const newFieldsBody = newVersion.models.flatMap((model) =>
      model.fields.map((field) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        validations: field?.validations,
        model: createdModels.find((m) => m.data.name === model.name)?.data.id,
      }))
    );

    const createdFields = await Promise.all(
      newFieldsBody.map((field) => createFieldAction(field))
    );

    const allFieldsSuccess = createdFields.every((field) => field.success);

    if (!allFieldsSuccess) {
      throw new Error("Field oluşturulurken bir hata oluştu");
    }

    const version = await fetchVersion(createdVersion.data.id);

    return { success: true, version: version.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Version oluşturulurken bir hata oluştu",
    };
  }
};
