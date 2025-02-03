import { NextRequest, NextResponse } from "next/server";
import { createFlowSession } from "@/lib/services/flowsession";
import { asyncFn } from "@/lib/middlewares/async";
import { FlowSession } from "@/lib/models/flowsession";
import { listing } from "@/lib/middlewares/listing";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const flowsession = await createFlowSession(body);
  return NextResponse.json(flowsession, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(FlowSession, req);
  return NextResponse.json(data);
});
