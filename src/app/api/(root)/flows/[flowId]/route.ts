import { NextResponse } from "next/server";
  import { 
    getFlowById,
    updateFlow,
    deleteFlow
  } from "@/lib/services/flow";
  
  type RouteParams = Promise<{
    flowId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const flow = await getFlowById(resolvedParams.flowId);
      return NextResponse.json(flow);
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
      const flow = await updateFlow(resolvedParams.flowId, body);
      return NextResponse.json(flow);
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
      await deleteFlow(resolvedParams.flowId);
      return NextResponse.json({ message: "Flow başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }