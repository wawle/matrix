import { NextRequest, NextResponse } from "next/server";
import { getModelById, updateModel, deleteModel } from "@/lib/services/model";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  modelId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { modelId } = await params;
    const model = await getModelById(modelId);
    return NextResponse.json(model);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { modelId } = await params;
    const body = await req.json();
    const model = await updateModel(modelId, body);
    return NextResponse.json(model);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { modelId } = await params;
    const model = await deleteModel(modelId);
    return NextResponse.json(model);
  }
);
