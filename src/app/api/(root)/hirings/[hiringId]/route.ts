import { NextRequest, NextResponse } from "next/server";
import {
  getHiringById,
  updateHiring,
  deleteHiring,
} from "@/lib/services/hiring";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  hiringId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { hiringId } = await params;
    const hiring = await getHiringById(hiringId);
    return NextResponse.json(hiring);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { hiringId } = await params;
    const body = await req.json();
    const hiring = await updateHiring(hiringId, body);
    return NextResponse.json(hiring);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { hiringId } = await params;
    const hiring = await deleteHiring(hiringId);
    return NextResponse.json(hiring);
  }
);
