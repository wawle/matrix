import { NextRequest, NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { createNode, getNodes } from "@/lib/services/node";

export const GET = asyncFn(async (req: NextRequest) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);
  const data = await getNodes(searchParams);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const node = await createNode(body);
  return NextResponse.json(node, { status: 201 });
});
