import { NextResponse } from "next/server";
import { createToken } from "@/lib/session";
import { login } from "@/lib/services/auth";
import { asyncFn } from "@/lib/middlewares/async";
import { IUser } from "@/lib/models/user";

export const POST = asyncFn(
  async (
    request: Request
  ): Promise<NextResponse<{ token: string; user: IUser }>> => {
    const body = await request.json();
    const user = await login(body);
    const token = await createToken(user);
    return NextResponse.json({ token, user });
  }
);
