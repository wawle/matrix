import { NextRequest, NextResponse } from "next/server";
import { getFlowById, updateFlow, deleteFlow } from "@/lib/services/flow";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  flowId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowId } = await params;
    const flow = await getFlowById(flowId);
    return NextResponse.json(flow);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowId } = await params;
    const body = await req.json();
    const flow = await updateFlow(flowId, body);
    return NextResponse.json(flow);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowId } = await params;
    const flow = await deleteFlow(flowId);
    return NextResponse.json(flow);
  }
);
