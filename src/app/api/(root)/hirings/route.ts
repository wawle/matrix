import { NextResponse } from "next/server";
  import { 
    createHiring, 
    getHirings 
  } from "@/lib/services/hiring";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const hiring = await createHiring(body);
  
      return NextResponse.json(hiring, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const hirings = await getHirings();
      return NextResponse.json(hirings);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }