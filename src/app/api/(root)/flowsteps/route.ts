import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { FlowStep } from "@/lib/models/flowstep";
import { createFlowStep } from "@/lib/services/flowstep";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(FlowStep, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const flowstep = await createFlowStep(body);
  return NextResponse.json(flowstep, { status: 201 });
});
