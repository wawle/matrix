import { NextResponse } from "next/server";
  import { 
    getHiringById,
    updateHiring,
    deleteHiring
  } from "@/lib/services/hiring";
  
  type RouteParams = Promise<{
    hiringId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const hiring = await getHiringById(resolvedParams.hiringId);
      return NextResponse.json(hiring);
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
      const hiring = await updateHiring(resolvedParams.hiringId, body);
      return NextResponse.json(hiring);
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
      await deleteHiring(resolvedParams.hiringId);
      return NextResponse.json({ message: "Hiring başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }