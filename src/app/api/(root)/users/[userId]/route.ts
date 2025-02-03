import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/services/user";
import { asyncFn } from "@/lib/middlewares/async";

type RouteParams = Promise<{
  userId: string;
}>;

export const GET = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { userId } = await params;
    const user = await getUserById(userId);
    return NextResponse.json(user);
  }
);

export const PUT = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { userId } = await params;
    const body = await req.json();
    const user = await updateUser(userId, body);
    return NextResponse.json(user);
  }
);

export const DELETE = asyncFn(
  async (req: NextRequest, { params }: { params: RouteParams }) => {
    const { userId } = await params;
    const user = await deleteUser(userId);
    return NextResponse.json(user);
  }
);
