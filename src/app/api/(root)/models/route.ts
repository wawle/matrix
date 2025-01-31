import { NextResponse } from "next/server";
  import { 
    createModel, 
    getModels 
  } from "@/lib/services/model";
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const model = await createModel(body);
  
      return NextResponse.json(model, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function GET() {
    try {
      const models = await getModels();
      return NextResponse.json(models);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }