import { NextRequest, NextResponse } from "next/server";
import {
  getFlowStepById,
  updateFlowStep,
  deleteFlowStep,
} from "@/lib/services/flowstep";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  flowstepId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowstepId } = await params;
    const flowstep = await getFlowStepById(flowstepId);
    return NextResponse.json(flowstep);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowstepId } = await params;
    const body = await req.json();
    const flowstep = await updateFlowStep(flowstepId, body);
    return NextResponse.json(flowstep);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { flowstepId } = await params;
    const flowstep = await deleteFlowStep(flowstepId);
    return NextResponse.json(flowstep);
  }
);
