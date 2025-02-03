import { NextResponse } from "next/server";
import { asyncFn } from "@/lib/middlewares/async";

export const GET = asyncFn(async () => {
  return NextResponse.json({ message: "Başarıyla çıkış yapıldı" });
});
