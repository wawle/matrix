import { NextRequest, NextResponse } from "next/server";
import { createEdge } from "@/lib/services/edge";
import { listing } from "@/lib/middlewares/listing";
import { Edge } from "@/lib/models/edge";
import { asyncFn } from "@/lib/middlewares/async";

export const POST = asyncFn(async (req: NextRequest) => {
  const body = await req.json();
  const edge = await createEdge(body);
  return NextResponse.json(edge, { status: 201 });
});

export const GET = asyncFn(async (req: NextRequest) => {
  const data = await listing(Edge, req);
  return NextResponse.json(data);
});
