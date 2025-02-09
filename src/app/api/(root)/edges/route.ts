import { NextRequest, NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";
import { createEdge, getEdges } from "@/lib/services/edge";

export const GET = asyncFn(async (req: NextRequest) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams);
  const data = await getEdges(searchParams);
  return NextResponse.json(data);
});

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const edge = await createEdge(body);
  return NextResponse.json(edge, { status: 201 });
});
