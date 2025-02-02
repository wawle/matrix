export const logout = {
  template: (name: string, props: any) => {
    return `
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({ message: "Başarıyla çıkış yapıldı" });
  } catch (error) {
    return NextResponse.json(
      { message: "Çıkış yaparken bir hata oluştu" },
      { status: 500 }
    );
  }
}
    `;
  },
};
