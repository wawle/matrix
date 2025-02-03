import { NextRequest, NextResponse } from "next/server";
import { getAgentById, updateAgent, deleteAgent } from "@/lib/services/agent";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  agentId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { agentId } = await params;
    const agent = await getAgentById(agentId);
    return NextResponse.json(agent);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { agentId } = await params;
    const body = await req.json();
    const agent = await updateAgent(agentId, body);
    return NextResponse.json(agent);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { agentId } = await params;
    const agent = await deleteAgent(agentId);
    return NextResponse.json(agent);
  }
);
