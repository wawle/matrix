import { NextResponse } from "next/server";
  import { 
    getEdgeById,
    updateEdge,
    deleteEdge
  } from "@/lib/services/edge";
  
  type RouteParams = Promise<{
    edgeId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const edge = await getEdgeById(resolvedParams.edgeId);
      return NextResponse.json(edge);
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
      const edge = await updateEdge(resolvedParams.edgeId, body);
      return NextResponse.json(edge);
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
      await deleteEdge(resolvedParams.edgeId);
      return NextResponse.json({ message: "Edge başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }