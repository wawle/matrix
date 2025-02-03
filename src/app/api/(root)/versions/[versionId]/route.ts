import { NextRequest, NextResponse } from "next/server";
import {
  getVersionById,
  updateVersion,
  deleteVersion,
} from "@/lib/services/version";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  versionId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { versionId } = await params;
    const version = await getVersionById(versionId);
    return NextResponse.json(version);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { versionId } = await params;
    const body = await req.json();
    const version = await updateVersion(versionId, body);
    return NextResponse.json(version);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { versionId } = await params;
    const version = await deleteVersion(versionId);
    return NextResponse.json(version);
  }
);
