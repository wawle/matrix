import { NextResponse } from "next/server";
import { getMe } from "@/lib/services/auth";
import { asyncFn } from "@/lib/middlewares/async";
import { ErrorResponse } from "@/lib/middlewares/error";

export const GET = asyncFn(async (request: Request) => {
  let user: any = await request.headers.get("user");
  user = user ? JSON.parse(user) : null;

  if (!user) {
    throw new ErrorResponse("Kullanıcı bulunamadı", 404);
  }

  const dbUser = await getMe(user.id);

  if (!dbUser) {
    throw new ErrorResponse("Kullanıcı bulunamadı", 404);
  }

  return NextResponse.json(dbUser);
});
