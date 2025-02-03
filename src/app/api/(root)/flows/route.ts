import { NextRequest, NextResponse } from "next/server";
import { createFlow } from "@/lib/services/flow";
import { asyncFn } from "@/lib/middlewares/async";
import { Flow } from "@/lib/models/flow";
import { listing } from "@/lib/middlewares/listing";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const flow = await createFlow(body);
  return NextResponse.json(flow, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Flow, req);
  return NextResponse.json(data);
});
