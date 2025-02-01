import { Project, IProject } from "@/lib/models/project";
import connectDB from "@/lib/db";
import { Version } from "../models/version";
import { Model } from "../models/model";
import { Node } from "../models/node";
import { Edge } from "../models/edge";
import { Field } from "../models/field";

export async function getProjects(): Promise<IProject[]> {
  try {
    await connectDB();
    const projects = await Project.find()
      .populate({
        path: "versions",
        model: Version,
        select: "name is_active",
      })
      .sort({ createdAt: -1 });
    return projects;
  } catch (error: any) {
    throw new Error(
      error.message || "Project listesi alınırken bir hata oluştu"
    );
  }
}

export async function getProjectById(id: string): Promise<IProject> {
  try {
    await connectDB();
    const project = await Project.findById(id).populate({
      path: "versions",
      model: Version,
      select: "name is_active models nodes edges",
      populate: [
        {
          path: "models",
          model: Model,
          select: "name description fields",
          populate: {
            path: "fields",
            model: Field,
            select: "name type label validations",
          },
        },
        {
          path: "nodes",
          model: Node,
          select: "type position data",
        },
        {
          path: "edges",
          model: Edge,
          select: "source target data label animated",
        },
      ],
    });
    if (!project) {
      throw new Error("Project bulunamadı");
    }
    return project;
  } catch (error: any) {
    throw new Error(error.message || "Project alınırken bir hata oluştu");
  }
}

export async function createProject(data: any): Promise<IProject> {
  try {
    await connectDB();
    const project = await Project.create(data);
    return project;
  } catch (error: any) {
    throw new Error(error.message || "Project oluşturulurken bir hata oluştu");
  }
}

export async function updateProject(id: string, data: any): Promise<IProject> {
  try {
    await connectDB();
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!project) {
      throw new Error("Project bulunamadı");
    }
    return project;
  } catch (error: any) {
    throw new Error(error.message || "Project güncellenirken bir hata oluştu");
  }
}

export async function deleteProject(id: string): Promise<IProject> {
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new Error("Project bulunamadı");
    }
    return project;
  } catch (error: any) {
    throw new Error(error.message || "Project silinirken bir hata oluştu");
  }
}
