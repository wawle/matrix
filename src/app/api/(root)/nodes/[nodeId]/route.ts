import { NextRequest, NextResponse } from "next/server";
import { getNodeById, updateNode, deleteNode } from "@/lib/services/node";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  nodeId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { nodeId } = await params;
    const node = await getNodeById(nodeId);
    return NextResponse.json(node);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { nodeId } = await params;
    const body = await req.json();
    const node = await updateNode(nodeId, body);
    return NextResponse.json(node);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { nodeId } = await params;
    const node = await deleteNode(nodeId);
    return NextResponse.json(node);
  }
);
