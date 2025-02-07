import { Project, IProject } from "@/lib/models/project";
import connectDB from "@/lib/db";
import { Version } from "../models/version";
import { Node } from "../models/node";
import { Edge } from "../models/edge";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";
import { Model } from "../models/model";

export const getProjects = asyncFnService(async (): Promise<IProject[]> => {
  await connectDB();
  const projects = await Project.find()
    .populate({
      path: "versions",
      model: Version,
      select: "name is_active",
    })
    .sort({ createdAt: -1 });
  return projects;
});

export const getProjectById = asyncFnService(
  async (id: string): Promise<IProject> => {
    await connectDB();
    const project = await Project.findById(id).populate([
      {
        path: "versions",
        model: Version,
        populate: [
          {
            path: "nodes",
            model: Node,
            select: "position data type",
          },
          {
            path: "edges",
            model: Edge,
            select: "source target data label animated",
          },
        ],
      },
      {
        path: "models",
        model: Model,
      },
    ]);
    if (!project) {
      throw new ErrorResponse("Project bulunamadı", 404);
    }
    return project;
  }
);

export const createProject = asyncFnService(
  async (data: any): Promise<IProject> => {
    await connectDB();
    const project = await Project.create(data);
    if (!project) {
      throw new ErrorResponse("Project oluşturulurken bir hata oluştu", 400);
    }
    return project;
  }
);

export const updateProject = asyncFnService(
  async (id: string, data: any): Promise<IProject> => {
    await connectDB();
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!project) {
      throw new ErrorResponse("Project bulunamadı", 404);
    }
    return project;
  }
);

export const deleteProject = asyncFnService(
  async (id: string): Promise<IProject> => {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new ErrorResponse("Project bulunamadı", 404);
    }
    return project;
  }
);
