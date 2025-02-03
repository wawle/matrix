import { NextRequest, NextResponse } from "next/server";
import { createChat } from "@/lib/services/chat";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Chat } from "@/lib/models/chat";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const chat = await createChat(body);
  return NextResponse.json(chat, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Chat, req);
  return NextResponse.json(data);
});
