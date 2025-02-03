import { NextRequest, NextResponse } from "next/server";
import { createField } from "@/lib/services/field";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Field } from "@/lib/models/field";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const field = await createField(body);
  return NextResponse.json(field, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Field, req);
  return NextResponse.json(data);
});
