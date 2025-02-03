import { NextRequest, NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Family } from "@/lib/models/family";
import { createFamily } from "@/lib/services/family";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const family = await createFamily(body);
  return NextResponse.json(family, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Family, req);
  return NextResponse.json(data);
});
