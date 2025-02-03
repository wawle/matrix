import { NextRequest, NextResponse } from "next/server";
import { getKeyById, updateKey, deleteKey } from "@/lib/services/key";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  keyId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { keyId } = await params;
    const key = await getKeyById(keyId);
    return NextResponse.json(key);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { keyId } = await params;
    const body = await req.json();
    const key = await updateKey(keyId, body);
    return NextResponse.json(key);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { keyId } = await params;
    const key = await deleteKey(keyId);
    return NextResponse.json(key);
  }
);
