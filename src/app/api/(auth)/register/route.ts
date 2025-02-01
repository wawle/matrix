import { NextResponse } from "next/server";
import { createToken } from "@/lib/session";
import { register } from "@/lib/services/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Yeni kullanıcı oluştur
    // Yeni kullanıcı oluştur
    const user = await register(body);

    // Token oluştur
    const token = await createToken(user);

    // Kullanıcı bilgilerini döndür (hassas bilgiler hariç)
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        photo: user.photo,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
