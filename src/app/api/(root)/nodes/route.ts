import { NextResponse } from "next/server";
import { createNode } from "@/lib/services/node";
import { asyncFn } from "@/lib/middlewares/async";
import { listing } from "@/lib/middlewares/listing";
import { Node } from "@/lib/models/node";
import { NextRequest } from "next/server";

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Node, req);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const node = await createNode(body);
  return NextResponse.json(node, { status: 201 });
});
