import { NextRequest, NextResponse } from "next/server";
import {
  getSessionById,
  updateSession,
  deleteSession,
} from "@/lib/services/session";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  sessionId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { sessionId } = await params;
    const session = await getSessionById(sessionId);
    return NextResponse.json(session);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { sessionId } = await params;
    const body = await req.json();
    const session = await updateSession(sessionId, body);
    return NextResponse.json(session);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { sessionId } = await params;
    const session = await deleteSession(sessionId);
    return NextResponse.json(session);
  }
);
