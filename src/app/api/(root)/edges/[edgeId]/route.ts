import { NextRequest, NextResponse } from "next/server";
import { getEdgeById, updateEdge, deleteEdge } from "@/lib/services/edge";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  edgeId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { edgeId } = await params;
    const edge = await getEdgeById(edgeId);
    return NextResponse.json(edge);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { edgeId } = await params;
    const body = await req.json();
    const edge = await updateEdge(edgeId, body);
    return NextResponse.json(edge);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { edgeId } = await params;
    const edge = await deleteEdge(edgeId);
    return NextResponse.json(edge);
  }
);
