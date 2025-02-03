import { NextRequest, NextResponse } from "next/server";
import { getChatById, updateChat, deleteChat } from "@/lib/services/chat";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  chatId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { chatId } = await params;
    const chat = await getChatById(chatId);
    return NextResponse.json(chat);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { chatId } = await params;
    const body = await req.json();
    const chat = await updateChat(chatId, body);
    return NextResponse.json(chat);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { chatId } = await params;
    const chat = await deleteChat(chatId);
    return NextResponse.json(chat);
  }
);
