
import { NextResponse } from "next/server";
import { createToken } from "@/lib/session";
import { login } from "@/lib/services/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await login(body);

    if (!user) {
      return NextResponse.json(
        { message: "E-posta veya şifre hatalı" },
        { status: 401 }
      );
    }

    // Token oluştur
    const token = await createToken(user);

    // Kullanıcı bilgilerini döndür (hassas bilgiler hariç)
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        photo: user?.photo || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}

    