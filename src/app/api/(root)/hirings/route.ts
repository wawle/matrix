import { NextRequest, NextResponse } from "next/server";
import { createHiring } from "@/lib/services/hiring";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Hiring } from "@/lib/models/hiring";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Hiring, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const hiring = await createHiring(body);
  return NextResponse.json(hiring, { status: 201 });
});
