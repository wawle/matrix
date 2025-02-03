import { NextRequest, NextResponse } from "next/server";
import { createAgent } from "@/lib/services/agent";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Agent } from "@/lib/models/agent";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const agent = await createAgent(body);
  return NextResponse.json(agent, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Agent, req);
  return NextResponse.json(data);
});
