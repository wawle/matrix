import { NextRequest, NextResponse } from "next/server";

import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { createUser } from "@/lib/services/user";
import { User } from "@/lib/models/user";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(User, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
});
