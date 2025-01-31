import { NextResponse } from "next/server";
  import { 
    getNodeById,
    updateNode,
    deleteNode
  } from "@/lib/services/node";
  
  type RouteParams = Promise<{
    nodeId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const node = await getNodeById(resolvedParams.nodeId);
      return NextResponse.json(node);
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
      const node = await updateNode(resolvedParams.nodeId, body);
      return NextResponse.json(node);
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
      await deleteNode(resolvedParams.nodeId);
      return NextResponse.json({ message: "Node başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }