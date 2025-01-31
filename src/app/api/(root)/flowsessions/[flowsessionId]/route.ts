import { NextResponse } from "next/server";
  import { 
    getFlowSessionById,
    updateFlowSession,
    deleteFlowSession
  } from "@/lib/services/flowsession";
  
  type RouteParams = Promise<{
    flowsessionId: string;
  }>;
  
  export async function GET(request: Request, { params }: { params: RouteParams }) {
    try {
      const resolvedParams = await params;
      const flowsession = await getFlowSessionById(resolvedParams.flowsessionId);
      return NextResponse.json(flowsession);
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
      const flowsession = await updateFlowSession(resolvedParams.flowsessionId, body);
      return NextResponse.json(flowsession);
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
      await deleteFlowSession(resolvedParams.flowsessionId);
      return NextResponse.json({ message: "FlowSession başarıyla silindi" });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Bir hata oluştu" },
        { status: 500 }
      );
    }
  }