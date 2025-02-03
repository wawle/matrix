import { NextRequest, NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { Version } from "@/lib/models/version";
import { listing } from "@/lib/middlewares/listing";
import { createVersion } from "@/lib/services/version";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Version, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const version = await createVersion(body);
  return NextResponse.json(version, { status: 201 });
});
