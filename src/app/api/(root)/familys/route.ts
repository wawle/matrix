import { NextResponse } from "next/server";
  import { 
    createFamily, 
    getFamilys 
  } from "@/lib/services/family";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const family = await createFamily(body);
  
      return NextResponse.json(family, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const familys = await getFamilys();
      return NextResponse.json(familys);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }