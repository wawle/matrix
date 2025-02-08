import { NextRequest, NextResponse } from "next/server";
import { createAgent, getAgents } from "@/lib/services/agent";
import { asyncFn } from "@/lib/middlewares/async";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const agent = await createAgent(body);
  return NextResponse.json(agent, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);
  const data = await getAgents(searchParams);
  return NextResponse.json(data);
});
