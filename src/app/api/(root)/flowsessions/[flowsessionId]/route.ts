import { NextRequest, NextResponse } from "next/server";
import {
  getFlowSessionById,
  updateFlowSession,
  deleteFlowSession,
} from "@/lib/services/flowsession";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  flowsessionId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowsessionId } = await params;
    const flowsession = await getFlowSessionById(flowsessionId);
    return NextResponse.json(flowsession);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowsessionId } = await params;
    const body = await req.json();
    const flowsession = await updateFlowSession(flowsessionId, body);
    return NextResponse.json(flowsession);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowsessionId } = await params;
    const flowsession = await deleteFlowSession(flowsessionId);
    return NextResponse.json(flowsession);
  }
);
