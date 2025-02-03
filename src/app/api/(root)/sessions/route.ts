import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/services/session";
import { listing } from "@/lib/middlewares/listing";
import { asyncFn } from "@/lib/middlewares/async";
import { Session } from "@/lib/models/session";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Session, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const session = await createSession(body);
  return NextResponse.json(session, { status: 201 });
});
