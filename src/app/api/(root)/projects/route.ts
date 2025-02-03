import { NextRequest, NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Project } from "@/lib/models/project";
import { createProject } from "@/lib/services/project";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Project, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const project = await createProject(body);
  return NextResponse.json(project, { status: 201 });
});
