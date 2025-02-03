import { NextRequest, NextResponse } from "next/server";
import {
  getFamilyById,
  updateFamily,
  deleteFamily,
} from "@/lib/services/family";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  familyId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { familyId } = await params;
    const family = await getFamilyById(familyId);
    return NextResponse.json(family);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { familyId } = await params;
    const body = await req.json();
    const family = await updateFamily(familyId, body);
    return NextResponse.json(family);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { familyId } = await params;
    const family = await deleteFamily(familyId);
    return NextResponse.json(family);
  }
);
