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
import { createModelAction, fetchModels, updateModelAction } from "./model";
import { createFieldAction, updateFieldAction } from "./field";
import { createNodeAction, updateNodeAction } from "./node";
import { createEdgeAction, updateEdgeAction } from "./edge";
import { fetchProject } from "./project";
import { createNextProject } from "../xgo/generators/app";
import { INodeField } from "../types/xgo";
import mongoose from "mongoose";

export async function fetchVersions() {
  try {
    const versions = await getVersions();
    return { data: JSON.parse(JSON.stringify(versions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchVersion(id: string): Promise<{
  data?: IVersion;
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
    revalidatePath("/versions");
    revalidatePath(`/xgo/projects/${version.project}/versions/${version.id}`);
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
  versionId: string,
  projectId: string
) => {
  try {
    const updatedVersionBody = convertTemplateToVersion(template, versionId);

    const newModelsBody = updatedVersionBody.models.map((model) => ({
      name: model.name,
      version: versionId,
      description: model.description,
      project: projectId,
    }));

    const newNodesBody = updatedVersionBody.nodes.map((node) => ({
      data: node.data,
      position: node.position,
      type: node.type,
      version: versionId,
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

    const newEdgesBody = updatedVersionBody.edges.map((edge) => {
      const sourceNode = createdNodes.find(
        (n) => n.data.data.name === edge.source
      )?.data?.id;
      const targetNode = createdNodes.find(
        (n) => n.data.data.name === edge.target
      )?.data?.id;

      return {
        version: versionId,
        source: sourceNode,
        target: targetNode,
        animated: edge.animated,
        label: edge.label,
        data: edge.data,
      };
    });

    const createdEdges = await Promise.all(
      newEdgesBody.map((edge) => createEdgeAction(edge))
    );

    const allEdgesSuccess = createdEdges.every((edge) => edge.success);

    if (!allEdgesSuccess) {
      throw new Error("Edge oluşturulurken bir hata oluştu");
    }

    const newFieldsBody = updatedVersionBody.models.flatMap((model) =>
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

    const version = await fetchVersion(versionId);

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

export const updateAppFromVersion = async (
  version: IVersion
): Promise<{
  success: boolean;
  error?: string;
  projectName?: string;
}> => {
  try {
    const { edges, nodes } = version;

    const updatedNodesBody = nodes.map((node) => ({
      id: node.id,
      data: {
        name: node.data.name,
        description: node.data.description,
        isActive: node.data.isActive,
        fields: node.data.fields,
      },
      type: node.type,
      position: node.position,
      version: node.version,
    }));

    const updatedEdgesBody = edges.map((edge) => ({
      id: edge.id,
      data: edge.data,
      source: edge.source,
      target: edge.target,
      version: edge.version,
    }));

    const updatedModelsBody = nodes.map((node) => ({
      id: node.id,
      name: node.data.name,
      description: node.data.description,
      project: version.project,
    }));

    const updatedFieldsBody = nodes.flatMap((node) =>
      node.data.fields.map((field: INodeField) => ({
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,
        validations: field.validations,
        model: updatedModelsBody.find((m) => m.name === node.data.name)?.id,
      }))
    );

    const [updateNodes, updateEdges, updateModels, updateFields] =
      await Promise.all([
        Promise.all(
          updatedNodesBody.map((node) => updateNodeAction(node.id, node))
        ),
        Promise.all(
          updatedEdgesBody.map((edge) => updateEdgeAction(edge.id, edge))
        ),
        Promise.all(
          updatedModelsBody.map((model) =>
            mongoose.Types.ObjectId.isValid(model.id)
              ? updateModelAction(model.id, model)
              : createModelAction(model)
          )
        ),
        Promise.all(
          updatedFieldsBody.map((field) =>
            mongoose.Types.ObjectId.isValid(field.id)
              ? updateFieldAction(field.id, field)
              : createFieldAction(field)
          )
        ),
      ]);

    const allNodesSuccess = updateNodes.every((node) => node.success);
    const allEdgesSuccess = updateEdges.every((edge) => edge.success);
    const allModelsSuccess = updateModels.every((model) => model.success);
    const allFieldsSuccess = updateFields.every((field) => field.success);

    if (
      !allNodesSuccess ||
      !allEdgesSuccess ||
      !allModelsSuccess ||
      !allFieldsSuccess
    ) {
      throw new Error(
        "Node veya Edge veya Model veya Field güncellenirken bir hata oluştu"
      );
    }

    return { success: true };
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

export async function generateAppAction(
  versionId: string,
  projectId: string
): Promise<{
  success: boolean;
  error?: string;
  projectName?: string;
}> {
  try {
    const [project, version, models] = await Promise.all([
      fetchProject(projectId),
      fetchVersion(versionId),
      fetchModels({ project: projectId }),
    ]);

    if (
      !version.success ||
      !project.success ||
      !version.data ||
      !project.data ||
      !models.data
    ) {
      throw new Error(version.error || project.error);
    }

    const appData = {
      projectName: project.data.name,
      version: {
        name: version.data.name,
        models: models.data,
        relations: version.data.edges,
      },
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
