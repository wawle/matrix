import { NextResponse } from "next/server";
  import { 
    getFieldById,
    updateField,
    deleteField
  } from "@/lib/services/field";
  
  type RouteParams = Promise<{
    fieldId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const field = await getFieldById(resolvedParams.fieldId);
      return NextResponse.json(field);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const body = await request.json();
      const field = await updateField(resolvedParams.fieldId, body);
      return NextResponse.json(field);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      await deleteField(resolvedParams.fieldId);
      return NextResponse.json({ message: "Field başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }