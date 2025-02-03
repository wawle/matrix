import { NextRequest, NextResponse } from "next/server";
import { getFieldById, updateField, deleteField } from "@/lib/services/field";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  fieldId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { fieldId } = await params;
    const field = await getFieldById(fieldId);
    return NextResponse.json(field);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { fieldId } = await params;
    const body = await req.json();
    const field = await updateField(fieldId, body);
    return NextResponse.json(field);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { fieldId } = await params;
    const field = await deleteField(fieldId);
    return NextResponse.json(field);
  }
);
