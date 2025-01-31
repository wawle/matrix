
import { NextResponse } from "next/server";
import { getMe } from "@/lib/services/auth";

export async function GET(request: Request) {
  try {
    let user: any = await request.headers.get("user");
    user = user ? JSON.parse(user) : null;

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const dbUser = await getMe(user.id);

    if (!dbUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: dbUser, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
    