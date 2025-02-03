import { NextRequest, NextResponse } from "next/server";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/services/project";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  projectId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { projectId } = await params;
    const project = await getProjectById(projectId);
    return NextResponse.json(project);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { projectId } = await params;
    const body = await req.json();
    const project = await updateProject(projectId, body);
    return NextResponse.json(project);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { projectId } = await params;
    const project = await deleteProject(projectId);
    return NextResponse.json(project);
  }
);
