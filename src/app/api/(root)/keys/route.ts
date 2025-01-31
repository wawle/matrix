import { NextResponse } from "next/server";
  import { 
    createKey, 
    getKeys 
  } from "@/lib/services/key";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const key = await createKey(body);
  
      return NextResponse.json(key, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const keys = await getKeys();
      return NextResponse.json(keys);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }