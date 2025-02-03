import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Key } from "@/lib/models/key";
import { NextRequest } from "next/server";
import { createKey } from "@/lib/services/key";
import { NextResponse } from "next/server";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Key, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const key = await createKey(body);
  return NextResponse.json(key, { status: 201 });
});
