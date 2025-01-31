import { NextResponse } from "next/server";
  import { 
    createField, 
    getFields 
  } from "@/lib/services/field";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const field = await createField(body);
  
      return NextResponse.json(field, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const fields = await getFields();
      return NextResponse.json(fields);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }