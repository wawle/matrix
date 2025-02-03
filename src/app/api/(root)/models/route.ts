import { NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Model } from "@/lib/models/model";
import { NextRequest } from "next/server";
import { createModel } from "@/lib/services/model";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Model, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const model = await createModel(body);
  return NextResponse.json(model, { status: 201 });
});
